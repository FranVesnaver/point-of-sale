package com.superpos.controller;

import com.superpos.dto.AddItemRequest;
import com.superpos.dto.SaleItemResponse;
import com.superpos.dto.SaleResponse;
import com.superpos.exception.SaleNotFoundException;
import com.superpos.model.Sale;
import com.superpos.repository.SaleRepository;
import com.superpos.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;
    private final SaleRepository saleRepository;

    public SaleController(SaleService saleService, SaleRepository saleRepository) {
        this.saleService = saleService;
        this.saleRepository = saleRepository;
    }

    @PostMapping
    public SaleResponse createSale() {
        Sale sale = saleService.createSale();
        Sale saved = saleRepository.save(sale);
        return toResponse(saved);
    }

    @PostMapping("/{saleId}/items")
    public SaleResponse addItem(
            @PathVariable Long saleId,
            @Valid @RequestBody AddItemRequest request
            ) {

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new SaleNotFoundException(saleId));

        saleService.addProductToSale(sale, request.getBarcode(), request.getQuantity());

        Sale updated = saleRepository.save(sale);
        return toResponse(updated);
    }

    @PostMapping("/{saleId}/finalize")
    public SaleResponse finalizeSale(
            @PathVariable Long saleId
    ) {

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new SaleNotFoundException(saleId));

        Sale finalizedSale = saleService.finalizeSale(sale);

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
        return response;
    }
}
