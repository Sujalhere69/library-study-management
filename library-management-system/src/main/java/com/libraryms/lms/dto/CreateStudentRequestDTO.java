package com.libraryms.lms.dto;

import lombok.Data;

@Data

public class CreateStudentRequestDTO {
    private String name;
    private String contactNumber;
    private String roomNumber;
    private int tableNumber;
    private double amountPaid;
}
