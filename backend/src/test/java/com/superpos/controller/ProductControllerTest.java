package com.superpos.controller;

import com.superpos.config.AuthInterceptor;
import com.superpos.exception.ExistingBarcodeException;
import com.superpos.exception.ProductNotFoundException;
import com.superpos.model.Category;
import com.superpos.model.Product;
import com.superpos.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @MockitoBean
    private ProductService productService;

    @MockitoBean
    private AuthInterceptor authInterceptor;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void allowInterceptor() {
        when(authInterceptor.preHandle(any(HttpServletRequest.class), any(HttpServletResponse.class), any()))
                .thenReturn(true);
    }

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
        product.setStock(BigDecimal.TEN);
        product.setMinStock(new BigDecimal("5"));
        product.setCategory(Category.OTHER);
        product.setAllowFractionalSale(false);

        when(productService.addProduct("123", "abc", BigDecimal.ONE, BigDecimal.TEN, new BigDecimal("5"), Category.OTHER, false))
                .thenReturn(product);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "barcode": "123",
                            "name": "abc",
                            "price": 1,
                            "stock": 10,
                            "minStock": 5,
                            "category": "OTHER",
                            "allowFractionalSale": false
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("abc"))
                .andExpect(jsonPath("$.barcode").value("123"))
                .andExpect(jsonPath("$.allowFractionalSale").value(false));
    }

    @Test
    void addProduct_shouldReturn409WhenTheBarcodeAlreadyExists() throws Exception {

        doThrow(new ExistingBarcodeException("123"))
                .when(productService)
                .addProduct(eq("123"), eq("abc"), eq(BigDecimal.ONE), eq(BigDecimal.TEN), eq(BigDecimal.TEN), eq(Category.OTHER), eq(false));

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "barcode": "123",
                            "name": "abc",
                            "price": 1,
                            "stock": 10,
                            "minStock": 10,
                            "category": "OTHER",
                            "allowFractionalSale": false
                        }
                        """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("EXISTING_BARCODE"));
    }

    @Test
    void updateProduct_shouldReturn200AndProduct() throws Exception {
        Product product = new Product();
        product.setId(1L);
        product.setBarcode("345");
        product.setName("dfe");
        product.setPrice(BigDecimal.TEN);
        product.setStock(new BigDecimal("15"));
        product.setMinStock(new BigDecimal("5"));
        product.setCategory(Category.OTHER);
        product.setAllowFractionalSale(true);

        when(productService.updateProduct(1L, "345", "dfe", BigDecimal.TEN, new BigDecimal("15"), new BigDecimal("5"), Category.OTHER, true))
                .thenReturn(product);

        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "barcode": "345",
                            "name": "dfe",
                            "price": 10,
                            "stock": 15,
                            "minStock": 5,
                            "category": "OTHER",
                            "allowFractionalSale": true
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.barcode").value("345"))
                .andExpect(jsonPath("$.name").value("dfe"))
                .andExpect(jsonPath("$.price").value(10))
                .andExpect(jsonPath("$.stock").value(15))
                .andExpect(jsonPath("$.minStock").value(5))
                .andExpect(jsonPath("$.category").value("OTHER"))
                .andExpect(jsonPath("$.allowFractionalSale").value(true));

        verify(productService, times(1))
                .updateProduct(1L, "345", "dfe", BigDecimal.TEN, new BigDecimal("15"), new BigDecimal("5"), Category.OTHER, true);
    }

    @Test
    void updateProduct_return404WhenProductNotFound() throws Exception {

        doThrow(new ProductNotFoundException(1L))
                .when(productService)
                .updateProduct(eq(1L), anyString(), anyString(), any(BigDecimal.class), any(BigDecimal.class), any(BigDecimal.class), any(Category.class), anyBoolean());

        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "barcode": "345",
                            "name": "dfe",
                            "price": 10,
                            "stock": 15,
                            "minStock": 5,
                            "category": "OTHER",
                            "allowFractionalSale": false
                        }
                        """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("PRODUCT_NOT_FOUND"));
    }
}
