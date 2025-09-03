package com.libraryms.lms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    private boolean paid;

    private LocalDate paymentDate;

    private LocalDate dueDate;

    // Number of months of validity paid for
    private Integer durationMonths;

    @OneToOne
    private Student student;
}
