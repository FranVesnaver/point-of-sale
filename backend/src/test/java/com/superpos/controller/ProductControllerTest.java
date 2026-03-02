package com.superpos.controller;

import com.superpos.model.Product;
import com.superpos.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

}