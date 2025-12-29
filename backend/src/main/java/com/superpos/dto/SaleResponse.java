package com.superpos.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class SaleResponse {

    private Long id;
    private BigDecimal total;
    private List<SaleItemResponse> items;

}
