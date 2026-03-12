package com.superpos.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductResponse {

    private Long id;
    private String name;
    private String barcode;
    private BigDecimal price;
    private int stock;
    private int minStock;

}
