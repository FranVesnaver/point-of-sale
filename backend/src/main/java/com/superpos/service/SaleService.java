package com.superpos.service;

import com.superpos.exception.SaleNotFoundException;
import com.superpos.model.PaymentMethod;
import com.superpos.model.Product;
import com.superpos.model.Sale;
import com.superpos.model.SaleItem;
import com.superpos.repository.ProductRepository;
import com.superpos.repository.SaleRepository;
import com.superpos.exception.InsufficientStockException;
import com.superpos.exception.ProductWithBarcodeNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;

    public SaleService(ProductRepository productRepository, SaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
    }

    public List<Sale> getSales() {
        return saleRepository.findAll();
    }

    public Sale createSale() {
        Sale sale = new Sale();
        sale.setDateTime(LocalDateTime.now());
        sale.setTotal(BigDecimal.ZERO);
        sale.setPaymentMethod(PaymentMethod.CASH);
        return saleRepository.save(sale);
    }

    public Sale addProductToSale(Long saleId, String barcode, BigDecimal quantity) {
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new SaleNotFoundException(saleId));


        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ProductWithBarcodeNotFoundException(barcode));

        validateQuantity(product, quantity);

        if (product.getStock().compareTo(quantity) < 0) {
            throw new InsufficientStockException(product.getName());
        }

        BigDecimal unitPrice = product.getPrice();
        BigDecimal subtotal = unitPrice.multiply(quantity);

        SaleItem saleItem = new SaleItem();
        saleItem.setSale(sale);
        saleItem.setProduct(product);
        saleItem.setQuantity(quantity);
        saleItem.setUnitPrice(unitPrice);
        saleItem.setSubtotal(subtotal);

        sale.getItems().add(saleItem);
        sale.setTotal(sale.getTotal().add(subtotal));

        return saleRepository.save(sale);
    }

    @Transactional
    public Sale finalizeSale(Long saleId, PaymentMethod paymentMethod) {
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new SaleNotFoundException(saleId));

        // discount items from stock
        for (SaleItem item : sale.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock().subtract(item.getQuantity()));
        }

        sale.setPaymentMethod(paymentMethod);

        return saleRepository.save(sale);
    }

    private void validateQuantity(Product product, BigDecimal quantity) {
        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        if (!product.isAllowFractionalSale() && quantity.stripTrailingZeros().scale() > 0) {
            throw new IllegalArgumentException("This product doesn't allow fractional sales");
        }
    }
}
