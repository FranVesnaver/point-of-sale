package com.superpos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
        name = "products",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "barcode")
        }
)
@Getter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @NotBlank
    @Column(nullable = false)
    private String barcode;

    @Setter
    @NotBlank
    @Column(nullable = false)
    private String name;

    @Setter
    @NotNull
    @DecimalMin(value = "0,01")
    private BigDecimal price;

    @Setter
    @Min(0)
    @Column(nullable = false)
    private int stock;

    @Setter
    @Column(nullable = false)
    private boolean active = false;

}
