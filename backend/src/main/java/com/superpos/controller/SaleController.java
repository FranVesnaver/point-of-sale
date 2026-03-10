package com.superpos.controller;

import com.superpos.dto.AddItemRequest;
import com.superpos.dto.FinalizeSaleRequest;
import com.superpos.dto.SaleItemResponse;
import com.superpos.dto.SaleResponse;
import com.superpos.model.Sale;
import com.superpos.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public List<SaleResponse> getSales() {
        return saleService.getSales()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    public SaleResponse createSale() {
        Sale savedSale = saleService.createSale();
        return toResponse(savedSale);
    }

    @PostMapping("/{saleId}/items")
    public SaleResponse addItem(
            @PathVariable Long saleId,
            @Valid @RequestBody AddItemRequest request
            ) {

        Sale updatedSale = saleService.addProductToSale(saleId, request.getBarcode(), request.getQuantity());
        return toResponse(updatedSale);
    }

    @PostMapping("/{saleId}/finalize")
    public SaleResponse finalizeSale(
            @PathVariable Long saleId,
            @Valid @RequestBody FinalizeSaleRequest request
    ) {

        Sale finalizedSale = saleService.finalizeSale(saleId, request.getPaymentMethod());
        return toResponse(finalizedSale);
    }

    private SaleResponse toResponse(Sale sale) {
        SaleResponse response = new SaleResponse();
        response.setId(sale.getId());
        response.setTotal(sale.getTotal());

        List<SaleItemResponse> items = sale.getItems().stream().map(
            item -> {
                SaleItemResponse r = new SaleItemResponse();
                r.setProductName(item.getProduct().getName());
                r.setQuantity(item.getQuantity());
                r.setUnitPrice(item.getUnitPrice());
                r.setSubtotal(item.getSubtotal());
                return r;
            }
        ).toList();

        response.setItems(items);
        response.setDate(sale.getDateTime());
        response.setPaymentMethod(sale.getPaymentMethod());
        return response;
    }
}
