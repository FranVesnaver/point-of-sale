package com.superpos.controller;

import com.superpos.exception.ProductNotFoundException;
import com.superpos.model.Sale;
import com.superpos.repository.SaleRepository;
import com.superpos.service.SaleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SaleController.class)
class SaleControllerTest {

    @MockitoBean
    private SaleService saleService;

    @MockitoBean
    private SaleRepository saleRepository;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createSale_shouldReturn200AndSale() throws Exception {
        Sale sale = new Sale();
        sale.setId(1L);
        sale.setTotal(BigDecimal.ZERO);

        when(saleService.createSale()).thenReturn(sale);
        when(saleRepository.save(any())).thenReturn(sale);

        mockMvc.perform(post("/api/sales"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.total").value(0))
        ;
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
        Sale sale = new Sale();
        sale.setId(1L);

        when(saleRepository.findById(1L))
                .thenReturn(Optional.of(sale));

        doThrow(new ProductNotFoundException("123"))
                .when(saleService)
                .addProductToSale(any(), eq("123"), eq(1));

        mockMvc.perform(post("/api/sales/1/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "barcode": "123",
                            "quantity": 1
                        }
                        """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("PRODUCT_NOT_FOUND")
        );
    }
}