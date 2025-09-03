package com.libraryms.lms.dto;

import lombok.Data;

@Data
public class UpdatePaymentRequest {
    private Double amount;
    private Boolean paid;
    private Integer months; // number of months to extend from today
}


