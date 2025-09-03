package com.libraryms.lms.service;

import com.libraryms.lms.repository.StudentRepository;
import com.libraryms.lms.repository.PaymentRepository;
import com.libraryms.lms.repository.StudyTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DataCleanupService {

    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private StudyTableRepository studyTableRepository;

    @Transactional
    public void clearStudentData() {
        // Clear all payments first (due to foreign key constraints)
        paymentRepository.deleteAll();
        
        // Clear all students
        studentRepository.deleteAll();
        
        // Reset all study tables to unoccupied state
        studyTableRepository.findAll().forEach(table -> {
            table.setStudent(null);
            table.setOccupied(false);
            studyTableRepository.save(table);
        });
        
        System.out.println("✅ Student data cleared successfully!");
        System.out.println("🗑️ Deleted all students and payments");
        System.out.println("🪑 Reset all tables to unoccupied state");
        System.out.println("🏠 Rooms and table structure preserved");
    }
}

