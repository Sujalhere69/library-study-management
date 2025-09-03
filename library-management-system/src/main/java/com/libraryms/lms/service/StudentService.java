package com.libraryms.lms.service;

import com.libraryms.lms.dto.CreateStudentRequestDTO;
import com.libraryms.lms.dto.StudentTableInfoDTO;
import com.libraryms.lms.dto.UpdatePaymentRequest;
import com.libraryms.lms.model.Payment;
import com.libraryms.lms.model.Room;
import com.libraryms.lms.model.Student;
import com.libraryms.lms.model.StudyTable;
import com.libraryms.lms.repository.RoomRepository;
import com.libraryms.lms.repository.StudentRepository;
import com.libraryms.lms.repository.StudyTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudyTableRepository studyTableRepository;
    private final RoomRepository roomRepository;

    public String createStudentWithTable(CreateStudentRequestDTO dto) {

        // Step 1: Find the table in given room
        Room room = roomRepository.findByRoomNumber(dto.getRoomNumber())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        StudyTable table = studyTableRepository.findByRoomAndTableNumber(room, dto.getTableNumber())
                .orElseThrow(() -> new RuntimeException("Table not found in specified room"));

        if (table.isOccupied()) {
            throw new RuntimeException("Table is already occupied");
        }

        // Step 2: Create student
        Student student = new Student();
        student.setName(dto.getName());
        student.setContactNumber(dto.getContactNumber());
        student.setRollNumber(null);

        // Step 3: Create payment and assign
        Payment payment = new Payment();
        payment.setAmount(dto.getAmountPaid());
        payment.setPaid(true);
        payment.setPaymentDate(LocalDate.now());
        payment.setDurationMonths(1);
        payment.setDueDate(LocalDate.now().plusMonths(1));
        student.setPayment(payment);

        // Step 4: Assign student to table and save all
        student.setAssignedTable(table);
        student = studentRepository.save(student);

        table.setStudent(student);
        table.setOccupied(true);
        studyTableRepository.save(table);

        return "Student created and assigned to table successfully!";
    }

    // ✅ Final and correct version of mapStudentToDTO()
    public StudentTableInfoDTO mapStudentToDTO(Student student) {
        StudentTableInfoDTO dto = new StudentTableInfoDTO();
        dto.setId(student.getId());
        dto.setStudentName(student.getName());
        dto.setRollNumber(student.getRollNumber());
        dto.setContactNumber(student.getContactNumber());

        if (student.getAssignedTable() != null) {
            dto.setTableNumber(student.getAssignedTable().getTableNumber());

            if (student.getAssignedTable().getRoom() != null) {
                String rn = student.getAssignedTable().getRoom().getRoomNumber();
                if (rn != null && !rn.isEmpty()) {
                    dto.setRoomNumber(rn.substring(0, 1).toUpperCase());
                }
            }
        }

        Payment payment = student.getPayment();
        if (payment != null) {
            dto.setAmountPaid(payment.getAmount());
            dto.setPaid(payment.isPaid());
            dto.setPaymentDate(payment.getPaymentDate());
            dto.setDueDate(payment.getDueDate());
        }

        return dto;
    }

    public String updatePayment(Long studentId, UpdatePaymentRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Payment payment = student.getPayment();
        if (payment == null) {
            payment = new Payment();
            payment.setPaymentDate(LocalDate.now());
            student.setPayment(payment);
        }

        if (request.getAmount() != null) {
            payment.setAmount(request.getAmount());
        }
        if (request.getPaid() != null) {
            payment.setPaid(request.getPaid());
        }
        if (request.getMonths() != null && request.getMonths() > 0) {
            payment.setDurationMonths(request.getMonths());
            payment.setDueDate(LocalDate.now().plusMonths(request.getMonths()));
        }

        studentRepository.save(student);
        return "Payment updated";
    }

    public List<Map<String, Object>> getAllRooms() {
        return roomRepository.findAll().stream().map(room -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", room.getId());
            map.put("roomNumber", room.getRoomNumber());
            map.put("name", room.getName());
            return map;
        }).toList();
    }
}
