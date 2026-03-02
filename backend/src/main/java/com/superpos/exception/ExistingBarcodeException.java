package com.superpos.exception;

public class ExistingBarcodeException extends RuntimeException {
    public ExistingBarcodeException(String barcode) {
        super("The barcode exists for another product: " + barcode);
    }
}
