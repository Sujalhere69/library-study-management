package com.libraryms.lms.service;

import com.libraryms.lms.model.Student;
import com.libraryms.lms.model.StudyTable;
import com.libraryms.lms.repository.StudentRepository;
import com.libraryms.lms.repository.StudyTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TableService {

    @Autowired
    private  StudyTableRepository studyTableRepository;

    @Autowired
    private  StudentRepository studentRepository;


    /**
     * Assign a student to a study table.
     * This sets both sides of the relationship and marks the table as occupied.
     */
    public void assignStudentToTable(Long studentId, Long tableId) {
        Optional<StudyTable> optionalTable = studyTableRepository.findById(tableId);
        Optional<Student> optionalStudent = studentRepository.findById(studentId);

        if (optionalTable.isEmpty() || optionalStudent.isEmpty()) {
            throw new RuntimeException("Invalid table or student ID");
        }

        StudyTable table = optionalTable.get();
        Student student = optionalStudent.get();

        // Check if table is already occupied
        if (table.isOccupied()) {
            throw new RuntimeException("Table is already occupied.");
        }

        // Clear any existing assigned table for the student
        if (student.getAssignedTable() != null) {
            StudyTable previouslyAssignedTable = student.getAssignedTable();
            previouslyAssignedTable.setOccupied(false);
            previouslyAssignedTable.setStudent(null);
            studyTableRepository.save(previouslyAssignedTable);
        }

        // Assign new table
        table.setOccupied(true);
        table.setStudent(student);
        student.setAssignedTable(table);

        // Save changes
        studyTableRepository.save(table);
        studentRepository.save(student);
    }

    /**
     * Free the table and unassign the student from it.
     */
    public void freeTable(Long tableId) {
        Optional<StudyTable> optionalTable = studyTableRepository.findById(tableId);

        if (optionalTable.isEmpty()) {
            throw new RuntimeException("Table not found with ID: " + tableId);
        }

        StudyTable table = optionalTable.get();
        Student student = table.getStudent();

        // Remove the student from the table
        table.setStudent(null);
        table.setOccupied(false);

        if (student != null) {
            student.setAssignedTable(null);
            studentRepository.save(student);
        }

        studyTableRepository.save(table);
    }


    public void removeStudentFromTable(Long tableId) {
        StudyTable table = studyTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        table.setStudent(null);
        studyTableRepository.save(table);
    }
}
