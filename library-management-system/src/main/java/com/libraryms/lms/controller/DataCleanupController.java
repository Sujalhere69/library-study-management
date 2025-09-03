package com.libraryms.lms.controller;

import com.libraryms.lms.service.DataCleanupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cleanup")
public class DataCleanupController {

    @Autowired
    private DataCleanupService dataCleanupService;

    @DeleteMapping("/students")
    public ResponseEntity<String> clearStudentData() {
        try {
            dataCleanupService.clearStudentData();
            return ResponseEntity.ok("Student data cleared successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error clearing student data: " + e.getMessage());
        }
    }
}

