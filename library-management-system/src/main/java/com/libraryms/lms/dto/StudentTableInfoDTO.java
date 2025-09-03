package com.libraryms.lms.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentTableInfoDTO {
    private Long id;
    private String studentName;
    private String rollNumber;
    private String contactNumber;
    private int tableNumber;
    private String roomNumber;
    private double amountPaid;
    private boolean paid;
    private LocalDate paymentDate;
    private LocalDate dueDate;
}
