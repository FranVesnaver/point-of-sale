package com.superpos.controller;

import com.superpos.dto.AddProductRequest;
import com.superpos.dto.ProductResponse;
import com.superpos.dto.UpdateProductRequest;
import com.superpos.model.Product;
import com.superpos.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ProductResponse addProduct(
            @Valid @RequestBody AddProductRequest request
            ) {

        Product product = productService.addProduct(
                request.getBarcode(),
                request.getName(),
                request.getPrice(),
                request.getStock(),
                request.getMinStock(),
                request.getCategory()
        );

        return toResponse(product);
    }

    @PutMapping("/{productId}")
    public ProductResponse updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody UpdateProductRequest request
            ) {

        Product product = productService.updateProduct(
                productId,
                request.getBarcode(),
                request.getName(),
                request.getPrice(),
                request.getStock(),
                request.getMinStock(),
                request.getCategory()
        );
        return toResponse(product);
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setStock(product.getStock());
        response.setMinStock(product.getMinStock());
        response.setBarcode(product.getBarcode());
        response.setPrice(product.getPrice());
        response.setCategory(product.getCategory());
        return response;
    }
}
