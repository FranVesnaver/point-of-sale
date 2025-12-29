package com.superpos.service.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String barcode) {
        super("Product not found with barcode: " + barcode);
    }
}
