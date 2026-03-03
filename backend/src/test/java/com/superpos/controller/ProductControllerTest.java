package com.superpos.controller;

import com.superpos.exception.ExistingBarcodeException;
import com.superpos.model.Product;
import com.superpos.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @MockitoBean
    private ProductService productService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getProducts_shouldReturn200AndProducts() throws Exception {
        Product product1 = new Product();
        Product product2 = new Product();
        product1.setBarcode("111");
        product2.setBarcode("222");

        List<Product> products = List.of(product1, product2);

        when(productService.getProducts())
                .thenReturn(products);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].barcode").value("111"))
                .andExpect(jsonPath("$[1].barcode").value("222"));
    }

    @Test
    void addProduct_shouldReturn200AndProduct() throws Exception {
        Product product = new Product();
        product.setBarcode("123");
        product.setName("abc");
        product.setPrice(BigDecimal.ONE);
        product.setStock(10);

        when(productService.addProduct("123", "abc", BigDecimal.ONE, 10))
                .thenReturn(product);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "barcode": "123",
                            "name": "abc",
                            "price": 1,
                            "stock": 10
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("abc"))
                .andExpect(jsonPath("$.barcode").value("123"));
    }

    @Test
    void addProduct_shouldReturn409WhenTheBarcodeAlreadyExists() throws Exception {

        doThrow(new ExistingBarcodeException("123"))
                .when(productService)
                .addProduct("123", "abc", BigDecimal.ONE, 10);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "barcode": "123",
                            "name": "abc",
                            "price": 1,
                            "stock": 10
                        }
                        """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("EXISTING_BARCODE"));
    }
}