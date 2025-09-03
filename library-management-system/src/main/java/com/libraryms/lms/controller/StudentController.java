package com.libraryms.lms.controller;

import com.libraryms.lms.dto.CreateStudentRequestDTO;
import com.libraryms.lms.dto.StudentTableInfoDTO;
import com.libraryms.lms.dto.UpdatePaymentRequest;
import com.libraryms.lms.model.Student;
import com.libraryms.lms.model.Payment;
import com.libraryms.lms.repository.StudentRepository;
import com.libraryms.lms.repository.PaymentRepository;
import com.libraryms.lms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.libraryms.lms.model.StudyTable;
import com.libraryms.lms.repository.StudyTableRepository;


@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;
    private final StudentService studentService;
    private final StudyTableRepository studyTableRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public StudentController(StudentRepository studentRepository, StudentService studentService, StudyTableRepository studyTableRepository, PaymentRepository paymentRepository) {
        this.studentRepository = studentRepository;
        this.studentService = studentService;
        this.studyTableRepository = studyTableRepository;
        this.paymentRepository = paymentRepository;
    }


        @PostMapping("/assign")
        public ResponseEntity<String> createAndAssignStudent(@RequestBody CreateStudentRequestDTO dto) {
            String response = studentService.createStudentWithTable(dto);
            return ResponseEntity.ok(response);
        }




    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id).orElse(null);
    }
    @GetMapping("/student/{id}/table-info")
    public ResponseEntity<StudentTableInfoDTO> getStudentTableInfo(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        StudentTableInfoDTO dto = studentService.mapStudentToDTO(student);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/complete-info")
    public ResponseEntity<List<StudentTableInfoDTO>> getAllStudentsCompleteInfo() {
        List<Student> students = studentRepository.findAll();
        List<StudentTableInfoDTO> studentInfos = students.stream()
                .map(studentService::mapStudentToDTO)
                .toList();
        return ResponseEntity.ok(studentInfos);
    }

    @GetMapping("/available-tables")
    public ResponseEntity<List<Map<String, Object>>> getAvailableTables() {
        List<StudyTable> availableTables = studyTableRepository.findByIsOccupiedFalse();
        List<Map<String, Object>> tableInfo = availableTables.stream()
                .map(table -> {
                    Map<String, Object> info = new HashMap<>();
                    info.put("tableId", table.getId());
                    info.put("roomNumber", table.getRoomNumber());
                    info.put("tableNumber", table.getTableNumber());
                    info.put("roomName", table.getRoom() != null ? table.getRoom().getName() : "Unknown");
                    return info;
                })
                .toList();
        return ResponseEntity.ok(tableInfo);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<Map<String, Object>>> getRooms() {
        var rooms = studentService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<String> updatePayment(@PathVariable Long id, @RequestBody UpdatePaymentRequest request) {
        String msg = studentService.updatePayment(id, request);
        return ResponseEntity.ok(msg);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        // Unassign table if assigned
        if (student.getAssignedTable() != null) {
            StudyTable table = student.getAssignedTable();
            table.setStudent(null);
            table.setOccupied(false);
            studyTableRepository.save(table);
        }
        // Delete payment if exists to satisfy FK constraints
        if (student.getPayment() != null) {
            Payment payment = student.getPayment();
            paymentRepository.delete(payment);
        }
        studentRepository.delete(student);
        return ResponseEntity.ok("Student deleted successfully");
    }


}
