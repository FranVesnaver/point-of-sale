package com.superpos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddItemRequest {

    @NotBlank
    private String barcode;

    @Min(1)
    private int quantity;

}
