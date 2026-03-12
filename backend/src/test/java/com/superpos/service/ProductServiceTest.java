package com.superpos.service;

import com.superpos.exception.ExistingBarcodeException;
import com.superpos.exception.ProductNotFoundException;
import com.superpos.model.Category;
import com.superpos.model.Product;
import com.superpos.repository.ProductRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void addProduct_shouldCreateAndSaveProduct() {

        when(productRepository.existsByBarcode("123"))
                .thenReturn(false);

        when(productRepository.save(any(Product.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Product result = productService.addProduct(
                "123",
                "abc",
                BigDecimal.ONE,
                10,
                5,
                Category.OTHER
        );

        assertEquals("123", result.getBarcode());
        assertEquals("abc", result.getName());
        assertEquals(BigDecimal.ONE, result.getPrice());
        assertEquals(10, result.getStock());
        assertEquals(5, result.getMinStock());
        assertEquals(Category.OTHER, result.getCategory());

        verify(productRepository).existsByBarcode("123");
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void addProduct_shouldThrowExceptionWhenBarcodeExists() {

        when(productRepository.existsByBarcode("345"))
                .thenReturn(true);

        assertThrows(ExistingBarcodeException.class, () ->
                productService.addProduct(
                        "345",
                        "dfe",
                        BigDecimal.TEN,
                        15,
                        5,
                        Category.OTHER
                )
        );

        verify(productRepository, never()).save(any());
    }

    @Test
    void updateProduct_shouldChangeTheProductsValues() {
        Product product = new Product();
        product.setId(1L);
        product.setBarcode("123");
        product.setName("abc");
        product.setPrice(BigDecimal.ONE);
        product.setStock(10);
        product.setMinStock(5);
        product.setCategory(Category.OTHER);

        Product expectedUpdatedProduct = new Product();
        expectedUpdatedProduct.setId(1L);
        expectedUpdatedProduct.setBarcode("345");
        expectedUpdatedProduct.setName("dfe");
        expectedUpdatedProduct.setPrice(BigDecimal.TEN);
        expectedUpdatedProduct.setStock(15);
        expectedUpdatedProduct.setMinStock(10);
        expectedUpdatedProduct.setCategory(Category.BAKERY);

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Product actualUpdatedProduct = productService.updateProduct(1L, "345", "dfe", BigDecimal.TEN, 15, 10, Category.BAKERY);

        assertEquals(expectedUpdatedProduct, actualUpdatedProduct);
    }

    @Test
    void updateProduct_shouldThrowExceptionWhenProductNotFound() {
        when(productRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class,
                () -> productService.updateProduct(1L, "123", "abc", BigDecimal.ONE, 10, 5, Category.OTHER));
    }
}