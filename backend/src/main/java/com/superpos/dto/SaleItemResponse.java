package com.superpos.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SaleItemResponse {

    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

}
