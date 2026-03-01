package com.superpos.dto;

import lombok.Setter;

import java.math.BigDecimal;

@Setter
public class ProductResponse {

    private String name;
    private String barcode;
    private BigDecimal price;
    private int stock;

}
