package com.superpos.dto;

import com.superpos.model.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class SaleResponse {

    private Long id;
    private BigDecimal total;
    private List<SaleItemResponse> items;
    private PaymentMethod paymentMethod;
    private LocalDateTime date;

}
