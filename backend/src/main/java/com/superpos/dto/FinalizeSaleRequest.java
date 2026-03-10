package com.superpos.dto;

import com.superpos.model.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class FinalizeSaleRequest {

    @NotNull
    private PaymentMethod paymentMethod;

}
