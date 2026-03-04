package com.superpos.exception;

public class ProductWithBarcodeNotFoundException extends RuntimeException {
    public ProductWithBarcodeNotFoundException(String barcode) {
        super("Product not found with barcode: " + barcode);
    }
}
