package com.superpos.dto;

import com.superpos.model.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateProductRequest {

    @NotBlank
    private String name;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal stock;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal minStock;

    @NotBlank
    private String barcode;

    @NotNull
    private Category category;

    private boolean allowFractionalSale;

}
