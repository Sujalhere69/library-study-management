package com.libraryms.lms.model;

import com.libraryms.lms.model.StudyTable;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roomNumber;

    private String name; // e.g., "Room A"

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<StudyTable> tables;

}
