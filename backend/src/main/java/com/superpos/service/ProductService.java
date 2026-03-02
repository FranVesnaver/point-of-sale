package com.superpos.service;

import com.superpos.exception.ExistingBarcodeException;
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
            int stock
    ) {
        if (productRepository.existsByBarcode(barcode))
            throw new ExistingBarcodeException(barcode);

        Product product = new Product();
        product.setBarcode(barcode);
        product.setName(name);
        product.setPrice(price);
        product.setStock(stock);

        return productRepository.save(product);
    }

}
