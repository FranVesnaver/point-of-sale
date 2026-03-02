package com.superpos.controller;

import com.superpos.dto.ProductResponse;
import com.superpos.model.Product;
import com.superpos.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getProducts() {
        return productService.getProducts()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setName(product.getName());
        response.setStock(product.getStock());
        response.setBarcode(product.getBarcode());
        response.setPrice(product.getPrice());
        return response;
    }
}
