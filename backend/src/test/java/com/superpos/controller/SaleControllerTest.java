package com.superpos.controller;

import com.superpos.exception.InsufficientStockException;
import com.superpos.exception.ProductWithBarcodeNotFoundException;
import com.superpos.exception.SaleNotFoundException;
import com.superpos.model.Product;
import com.superpos.model.Sale;
import com.superpos.model.SaleItem;
import com.superpos.service.SaleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SaleController.class)
class SaleControllerTest {

    @MockitoBean
    private SaleService saleService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createSale_shouldReturn200AndSale() throws Exception {
        Sale sale = new Sale();
        sale.setId(1L);
        sale.setTotal(BigDecimal.ZERO);

        when(saleService.createSale()).thenReturn(sale);

        mockMvc.perform(post("/api/sales"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.total").value(0))
        ;
    }

    @Test
    void addItem_shouldReturn200AndSale() throws Exception {
        Product product = new Product();
        product.setName("abc");
        product.setBarcode("123");
        product.setPrice(BigDecimal.ONE);
        product.setStock(3);

        Sale sale = new Sale();
        sale.setId(1L);

        SaleItem saleItem = new SaleItem();
        saleItem.setProduct(product);
        saleItem.setQuantity(1);

        sale.getItems().add(saleItem);

        when(saleService.addProductToSale(sale.getId(), "123", 1))
                .thenReturn(sale);

        mockMvc.perform(post("/api/sales/1/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "barcode": "123",
                            "quantity": 1
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.items.length()").value(1));
    }

    @Test
    void addItem_shouldFailWhenQuantityIsZero() throws Exception {
        mockMvc.perform(post("/api/sales/1/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "barcode": "123",
                            "quantity": 0
                        }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR")
        );
    }

    @Test
    void addItem_shouldReturn404WhenProductNotFound() throws Exception {

        doThrow(new ProductWithBarcodeNotFoundException("123"))
                .when(saleService)
                .addProductToSale(eq(1L), eq("123"), eq(1));

        mockMvc.perform(post("/api/sales/1/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "barcode": "123",
                            "quantity": 1
                        }
                        """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("PRODUCT_WITH_BARCODE_NOT_FOUND"));
    }

    @Test
    void addItem_shouldReturn400WhenInsufficientStock() throws Exception {

        doThrow(new InsufficientStockException("abc"))
                .when(saleService)
                .addProductToSale(eq(1L), eq("123"), eq(2));

        mockMvc.perform(post("/api/sales/1/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "barcode": "123",
                            "quantity": 2
                        }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("INSUFFICIENT_STOCK"));
    }

    @Test
    void addItem_shouldReturn404WhenSaleNotFound() throws Exception {

        doThrow(new SaleNotFoundException(1L))
                .when(saleService)
                .addProductToSale(eq(1L), eq("123"), eq(1));

        mockMvc.perform(post("/api/sales/1/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "barcode": "123",
                            "quantity": 1
                        }
                        """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("SALE_NOT_FOUND"));
    }

    @Test
    void getSales_shouldReturn200AndSales() throws Exception {
        Sale sale1 = new Sale();
        sale1.setId(1L);
        sale1.setTotal(BigDecimal.ZERO);
        Sale sale2 = new Sale();
        sale2.setId(2L);
        sale2.setTotal(BigDecimal.ZERO);
        List<Sale> sales = List.of(sale1, sale2);

        when(saleService.getSales())
                .thenReturn(sales);

        mockMvc.perform(get("/api/sales"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].total").value(0))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].total").value(0));
    }

    @Test
    void finalize_shouldReturn200AndSale() throws Exception {
        Sale sale = new Sale();
        sale.setId(1L);

        when(saleService.finalizeSale(1L))
                .thenReturn(sale);

        mockMvc.perform(post("/api/sales/1/finalize"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void finalize_shouldReturn404WhenSaleNotFound() throws Exception {

        doThrow(new SaleNotFoundException(1L))
                .when(saleService)
                .finalizeSale(eq(1L));

        mockMvc.perform(post("/api/sales/1/finalize"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("SALE_NOT_FOUND"));
    }
}