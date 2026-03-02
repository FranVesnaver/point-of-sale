package com.superpos.service;

import com.superpos.model.Product;
import com.superpos.model.Sale;
import com.superpos.repository.ProductRepository;
import com.superpos.repository.SaleRepository;
import com.superpos.exception.InsufficientStockException;
import com.superpos.exception.ProductNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
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
    void addProductToSale_shouldAddItemAndUpdateTotal() {
        Product product = new Product();
        product.setBarcode("123");
        product.setName("Coca Cola");
        product.setPrice(new BigDecimal("100"));
        product.setStock(10);

        Sale sale = new Sale();
        sale.setId(1L);
        sale.setTotal(BigDecimal.ZERO);

        when(saleRepository.findById(1L))
                .thenReturn(Optional.of(sale));
        when(saleRepository.save(any(Sale.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(productRepository.findByBarcode("123"))
                .thenReturn(Optional.of(product));

        Sale updatedSale = saleService.addProductToSale(1L, "123", 2);

        assertEquals(1, updatedSale.getItems().size());
        assertEquals(new BigDecimal("200"), updatedSale.getTotal());
    }

    @Test
    void addProductToSale_insufficientStock() {
        Product product = new Product();
        product.setBarcode("123");
        product.setName("Coca Cola");
        product.setPrice(new BigDecimal("100"));
        product.setStock(1);

        Sale sale = new Sale();
        sale.setId(1L);
        sale.setTotal(BigDecimal.ZERO);

        when(saleRepository.findById(1L))
                .thenReturn(Optional.of(sale));
        when(productRepository.findByBarcode("123"))
                .thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class,
                () -> saleService.addProductToSale(1L, "123", 2)
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

        assertThrows(ProductNotFoundException.class,
                () -> saleService.addProductToSale(1L, "999", 1)
        );
    }

    @Test
    void finalizeSale_shouldDecreaseTheProductStock() {
        Product product = new Product();
        product.setBarcode("123");
        product.setName("Coca Cola");
        product.setPrice(new BigDecimal("100"));
        product.setStock(2);

        Sale sale = new Sale();
        sale.setId(1L);
        sale.setTotal(BigDecimal.ZERO);

        when(productRepository.findByBarcode("123"))
                .thenReturn(Optional.of(product));
        when(saleRepository.findById(1L))
                .thenReturn(Optional.of(sale));
        when(saleRepository.save(any(Sale.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        saleService.addProductToSale(sale.getId(), "123", 1);
        saleService.finalizeSale(sale.getId());

        assertEquals(1, product.getStock());
    }
}
