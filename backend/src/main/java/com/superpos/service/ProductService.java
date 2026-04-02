package com.superpos.service;

import com.superpos.exception.ExistingBarcodeException;
import com.superpos.exception.ProductNotFoundException;
import com.superpos.model.Category;
import com.superpos.model.Product;
import com.superpos.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(
            String barcode,
            String name,
            BigDecimal price,
            BigDecimal stock,
            BigDecimal minStock,
            Category category,
            boolean allowFractionalSale
    ) {
        if (productRepository.existsByBarcode(barcode))
            throw new ExistingBarcodeException(barcode);

        validateStockValues(stock, minStock, allowFractionalSale);

        Product product = new Product();
        product.setBarcode(barcode);
        product.setName(name);
        product.setPrice(price);
        product.setStock(stock);
        product.setMinStock(minStock);
        product.setCategory(category);
        product.setAllowFractionalSale(allowFractionalSale);

        return productRepository.save(product);
    }

    public Product updateProduct(
            Long productId,
            String barcode,
            String name,
            BigDecimal price,
            BigDecimal stock,
            BigDecimal minStock,
            Category category,
            boolean allowFractionalSale
    ) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        validateStockValues(stock, minStock, allowFractionalSale);

        product.setBarcode(barcode);
        product.setName(name);
        product.setPrice(price);
        product.setStock(stock);
        product.setMinStock(minStock);
        product.setCategory(category);
        product.setAllowFractionalSale(allowFractionalSale);

        return productRepository.save(product);
    }

    private void validateStockValues(BigDecimal stock, BigDecimal minStock, boolean allowFractionalSale) {
        if (allowFractionalSale) {
            return;
        }

        if (isDecimalNumber(stock) || isDecimalNumber(minStock)) {
            throw new IllegalArgumentException("Products that don't allow fractional sale must have an int as stock");
        }
    }

    private boolean isDecimalNumber(BigDecimal value) {
        return value.stripTrailingZeros().scale() > 0;
    }

}
