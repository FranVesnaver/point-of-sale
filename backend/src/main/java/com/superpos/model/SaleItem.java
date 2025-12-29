package com.superpos.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "sale_items")
@Getter
public class SaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "sale_id")
    private Sale sale;

    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Setter
    @Column(nullable = false)
    private int quantity;

    @Setter
    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Setter
    @Column(nullable = false)
    private BigDecimal subtotal;

}
