package com.superpos.service;

import com.superpos.model.Product;
import com.superpos.model.Sale;
import com.superpos.repository.ProductRepository;
import com.superpos.repository.SaleRepository;
import com.superpos.service.exception.InsufficientStockException;
import com.superpos.service.exception.ProductNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
    void addProductToSale() {
        Product product = new Product();
        product.setBarcode("123");
        product.setName("Coca Cola");
        product.setPrice(new BigDecimal("100"));
        product.setStock(10);

        when(productRepository.findByBarcode("123"))
                .thenReturn(Optional.of(product));

        Sale sale = saleService.createSale();

        saleService.addProductToSale(sale, "123", 2);

        assertEquals(1, sale.getItems().size());
        assertEquals(new BigDecimal("200"), sale.getTotal());
    }

    @Test
    void addProductToSale_insufficientStock() {
        Product product = new Product();
        product.setBarcode("123");
        product.setName("Coca Cola");
        product.setPrice(new BigDecimal("100"));
        product.setStock(1);

        when(productRepository.findByBarcode("123"))
                .thenReturn(Optional.of(product));

        Sale sale = saleService.createSale();

        assertThrows(InsufficientStockException.class,
                () -> saleService.addProductToSale(sale, "123", 2)
        );
    }

    @Test
    void addProductToSale_productNotFound() {
        when(productRepository.findByBarcode("999"))
                .thenReturn(Optional.empty());

        Sale sale = saleService.createSale();

        assertThrows(ProductNotFoundException.class,
                () -> saleService.addProductToSale(sale, "999", 1)
        );
    }

    @Test
    void finalizeSaleDecreasesTheProductStock() {
        Product product = new Product();
        product.setBarcode("123");
        product.setName("Coca Cola");
        product.setPrice(new BigDecimal("100"));
        product.setStock(2);

        when(productRepository.findByBarcode("123"))
                .thenReturn(Optional.of(product));

        Sale sale = saleService.createSale();

        when(saleRepository.save(sale)).thenReturn(sale);

        saleService.addProductToSale(sale, "123", 1);
        saleService.finalizeSale(sale);

        assertEquals(1, product.getStock());
    }
}
