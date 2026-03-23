package com.superpos.controller.advice;

import com.superpos.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.superpos.dto.error.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductWithBarcodeNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleProductWithBarcodeNotFound(ProductWithBarcodeNotFoundException e) {
        return new ErrorResponse(
                e.getMessage(),
                "PRODUCT_WITH_BARCODE_NOT_FOUND",
                HttpStatus.NOT_FOUND.value()
        );
    }

    @ExceptionHandler(ProductNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleProductNotFound(ProductNotFoundException e) {
        return new ErrorResponse(
                e.getMessage(),
                "PRODUCT_NOT_FOUND",
                HttpStatus.NOT_FOUND.value()
        );
    }

    @ExceptionHandler(SaleNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleSaleNotFound(SaleNotFoundException e) {
        return new ErrorResponse(
                e.getMessage(),
                "SALE_NOT_FOUND",
                HttpStatus.NOT_FOUND.value()
        );
    }

    @ExceptionHandler(InsufficientStockException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInsufficientStock(InsufficientStockException e) {
        return new ErrorResponse(
                e.getMessage(),
                "INSUFFICIENT_STOCK",
                HttpStatus.BAD_REQUEST.value()
        );
    }

    @ExceptionHandler(ExistingBarcodeException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleExistingBarcode(ExistingBarcodeException e) {
        return new ErrorResponse(
                e.getMessage(),
                "EXISTING_BARCODE",
                HttpStatus.CONFLICT.value()
        );
    }

    @ExceptionHandler(ExistingUsernameException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleExistingUsername(ExistingUsernameException e) {
        return new ErrorResponse(
                e.getMessage(),
                "EXISTING_USERNAME",
                HttpStatus.CONFLICT.value()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Validation error")
        ;

        return new ErrorResponse(
                message,
                "VALIDATION_ERROR",
                HttpStatus.BAD_REQUEST.value()
        );
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneric(Exception e) {
        return new ErrorResponse(
                "Unexpected error: " + e.getMessage(),
                "INTERNAL_ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
    }
}
