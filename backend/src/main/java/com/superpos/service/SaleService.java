package com.superpos.service;

import com.superpos.model.Product;
import com.superpos.model.Sale;
import com.superpos.model.SaleItem;
import com.superpos.repository.ProductRepository;
import com.superpos.repository.SaleRepository;
import com.superpos.exception.InsufficientStockException;
import com.superpos.exception.ProductNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class SaleService {

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;

    public SaleService(ProductRepository productRepository, SaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
    }

    public Sale createSale() {
        Sale sale = new Sale();
        sale.setDateTime(LocalDateTime.now());
        sale.setTotal(BigDecimal.ZERO);
        return sale;
    }

    public void addProductToSale(Sale sale, String barcode, int quantity) {
        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ProductNotFoundException(barcode));

        if (product.getStock() < quantity) {
            throw new InsufficientStockException(product.getName());
        }

        BigDecimal unitPrice = product.getPrice();
        BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));

        SaleItem saleItem = new SaleItem();
        saleItem.setSale(sale);
        saleItem.setProduct(product);
        saleItem.setQuantity(quantity);
        saleItem.setUnitPrice(unitPrice);
        saleItem.setSubtotal(subtotal);

        sale.getItems().add(saleItem);
        sale.setTotal(sale.getTotal().add(subtotal));
    }

    public Sale finalizeSale(Sale sale) {
        // discount items from stock
        for (SaleItem item : sale.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() - item.getQuantity());
        }

        return saleRepository.save(sale);
    }
}
