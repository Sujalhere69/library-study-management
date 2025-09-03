package com.libraryms.lms.controller;

import com.libraryms.lms.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tables")
public class TableController {

    @Autowired
    private  TableService tableService;

    @PostMapping("/assign")
    public ResponseEntity<String> assignStudentToTable(@RequestParam Long studentId, @RequestParam Long tableId) {
        tableService.assignStudentToTable(studentId, tableId);
        return ResponseEntity.ok("Student assigned to table successfully");
    }

    @PostMapping("/free")
    public ResponseEntity<String> freeTable(@RequestParam Long tableId) {
        tableService.freeTable(tableId);
        return ResponseEntity.ok("Table freed successfully");
    }
    @PostMapping("/remove-student")
    public ResponseEntity<String> removeStudentFromTable(@RequestParam Long tableId) {
        tableService.removeStudentFromTable(tableId);
        return ResponseEntity.ok("Student removed from table");
    }
}
