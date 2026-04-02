package com.superpos.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AddItemRequest {

    @NotBlank
    private String barcode;

    @NotNull
    @DecimalMin(value = "0.001")
    private BigDecimal quantity;

}
