package com.libraryms.lms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String rollNumber;

    private String contactNumber;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL)
    private StudyTable assignedTable;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL)
    private Payment payment;
}
