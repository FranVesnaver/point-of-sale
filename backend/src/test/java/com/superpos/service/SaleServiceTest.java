package com.superpos.service;

import com.superpos.model.PaymentMethod;
import com.superpos.model.Product;
import com.superpos.model.Sale;
import com.superpos.repository.ProductRepository;
import com.superpos.repository.SaleRepository;
import com.superpos.exception.InsufficientStockException;
import com.superpos.exception.ProductWithBarcodeNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SaleRepository saleRepository;

    @InjectMocks
    private SaleService saleService;

    @Test
    void createSale_shouldInitializeDateTimeAndTotalZero() {
        when(saleRepository.save(any(Sale.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        LocalDateTime beforeCreation = LocalDateTime.now();
        saleService.createSale();
        LocalDateTime afterCreation = LocalDateTime.now();

        ArgumentCaptor<Sale> saleCaptor = ArgumentCaptor.forClass(Sale.class);
        verify(saleRepository).save(saleCaptor.capture());
        Sale saleToSave = saleCaptor.getValue();

        assertNotNull(saleToSave.getDateTime());
        assertFalse(saleToSave.getDateTime().isBefore(beforeCreation));
        assertFalse(saleToSave.getDateTime().isAfter(afterCreation));
        assertEquals(BigDecimal.ZERO, saleToSave.getTotal());
    }

    @Test
    void createSale_shouldReturnSavedSale() {
        Sale savedSale = new Sale();
        savedSale.setId(10L);
        savedSale.setDateTime(LocalDateTime.now());
        savedSale.setTotal(BigDecimal.ZERO);

        when(saleRepository.save(any(Sale.class)))
                .thenReturn(savedSale);

        Sale result = saleService.createSale();

        assertSame(savedSale, result);
    }

    @Test
    void addProductToSale_shouldAddItemAndUpdateTotal() {
        Product product = new Product();
        product.setBarcode("123");
        product.setName("Coca Cola");
        product.setPrice(new BigDecimal("100"));
        product.setStock(BigDecimal.TEN);

        Sale sale = new Sale();
        sale.setId(1L);
        sale.setTotal(BigDecimal.ZERO);

        when(saleRepository.findById(1L))
                .thenReturn(Optional.of(sale));
        when(saleRepository.save(any(Sale.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(productRepository.findByBarcode("123"))
                .thenReturn(Optional.of(product));

        Sale updatedSale = saleService.addProductToSale(1L, "123", new BigDecimal("2"));

        assertEquals(1, updatedSale.getItems().size());
        assertEquals(new BigDecimal("200"), updatedSale.getTotal());
    }

    @Test
    void addProductToSale_insufficientStock() {
        Product product = new Product();
        product.setBarcode("123");
        product.setName("Coca Cola");
        product.setPrice(new BigDecimal("100"));
        product.setStock(BigDecimal.ONE);

        Sale sale = new Sale();
        sale.setId(1L);
        sale.setTotal(BigDecimal.ZERO);

        when(saleRepository.findById(1L))
                .thenReturn(Optional.of(sale));
        when(productRepository.findByBarcode("123"))
                .thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class,
                () -> saleService.addProductToSale(1L, "123", new BigDecimal("2"))
        );
    }

    @Test
    void addProductToSale_productNotFound() {
        Sale sale = new Sale();
        sale.setId(1L);
        sale.setTotal(BigDecimal.ZERO);

        when(saleRepository.findById(1L))
                .thenReturn(Optional.of(sale));
        when(productRepository.findByBarcode("999"))
                .thenReturn(Optional.empty());

        assertThrows(ProductWithBarcodeNotFoundException.class,
                () -> saleService.addProductToSale(1L, "999", BigDecimal.ONE)
        );
    }

    @Test
    void finalizeSale_shouldDecreaseTheProductStock() {
        Product product = new Product();
        product.setBarcode("123");
        product.setName("Coca Cola");
        product.setPrice(new BigDecimal("100"));
        product.setStock(new BigDecimal("2"));

        Sale sale = new Sale();
        sale.setId(1L);
        sale.setTotal(BigDecimal.ZERO);

        when(productRepository.findByBarcode("123"))
                .thenReturn(Optional.of(product));
        when(saleRepository.findById(1L))
                .thenReturn(Optional.of(sale));
        when(saleRepository.save(any(Sale.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        saleService.addProductToSale(sale.getId(), "123", BigDecimal.ONE);
        saleService.finalizeSale(sale.getId(), PaymentMethod.CASH);

        assertEquals(BigDecimal.ONE, product.getStock());
    }
}
