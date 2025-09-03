package com.libraryms.lms.config;

import com.libraryms.lms.model.Room;
import com.libraryms.lms.model.StudyTable;
import com.libraryms.lms.model.Student;
import com.libraryms.lms.model.Payment;
import com.libraryms.lms.repository.RoomRepository;
import com.libraryms.lms.repository.StudyTableRepository;
import com.libraryms.lms.repository.StudentRepository;
import com.libraryms.lms.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private StudyTableRepository studyTableRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no data exists
        if (roomRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create Rooms A, B, C, D
        Room roomA = new Room();
        roomA.setRoomNumber("A");
        roomA.setName("A");
        roomRepository.save(roomA);

        Room roomB = new Room();
        roomB.setRoomNumber("B");
        roomB.setName("B");
        roomRepository.save(roomB);

        Room roomC = new Room();
        roomC.setRoomNumber("C");
        roomC.setName("C");
        roomRepository.save(roomC);

        Room roomD = new Room();
        roomD.setRoomNumber("D");
        roomD.setName("D");
        roomRepository.save(roomD);

        // Create 15 Study Tables per room (1-15)
        for (int i = 1; i <= 15; i++) {
            StudyTable tA = new StudyTable();
            tA.setRoomNumber("A");
            tA.setTableNumber(i);
            tA.setOccupied(false);
            tA.setRoom(roomA);
            studyTableRepository.save(tA);

            StudyTable tB = new StudyTable();
            tB.setRoomNumber("B");
            tB.setTableNumber(i);
            tB.setOccupied(false);
            tB.setRoom(roomB);
            studyTableRepository.save(tB);

            StudyTable tC = new StudyTable();
            tC.setRoomNumber("C");
            tC.setTableNumber(i);
            tC.setOccupied(false);
            tC.setRoom(roomC);
            studyTableRepository.save(tC);

            StudyTable tD = new StudyTable();
            tD.setRoomNumber("D");
            tD.setTableNumber(i);
            tD.setOccupied(false);
            tD.setRoom(roomD);
            studyTableRepository.save(tD);
        }

        // Create Students with complete info
        Student student1 = new Student();
        student1.setName("Rahul Kumar");
        student1.setRollNumber("CS001");
        student1.setContactNumber("9876543210");
        studentRepository.save(student1);

        Student student2 = new Student();
        student2.setName("Priya Sharma");
        student2.setRollNumber("CS002");
        student2.setContactNumber("9876543211");
        studentRepository.save(student2);

        // Create Payments
        Payment payment1 = new Payment();
        payment1.setAmount(500.0);
        payment1.setPaid(true);
        payment1.setPaymentDate(LocalDate.now());
        payment1.setDueDate(LocalDate.now().plusMonths(1));
        payment1.setStudent(student1);
        paymentRepository.save(payment1);

        Payment payment2 = new Payment();
        payment2.setAmount(500.0);
        payment2.setPaid(true);
        payment2.setPaymentDate(LocalDate.now());
        payment2.setDueDate(LocalDate.now().plusMonths(1));
        payment2.setStudent(student2);
        paymentRepository.save(payment2);

        // Assign students to tables (examples)
        StudyTable tableA1 = studyTableRepository.findByRoomAndTableNumber(roomA, 1).orElseThrow();
        tableA1.setStudent(student1);
        tableA1.setOccupied(true);
        student1.setAssignedTable(tableA1);
        student1.setPayment(payment1);
        studyTableRepository.save(tableA1);
        studentRepository.save(student1);

        StudyTable tableB1 = studyTableRepository.findByRoomAndTableNumber(roomB, 1).orElseThrow();
        tableB1.setStudent(student2);
        tableB1.setOccupied(true);
        student2.setAssignedTable(tableB1);
        student2.setPayment(payment2);
        studyTableRepository.save(tableB1);
        studentRepository.save(student2);

        System.out.println("✅ Database initialized with sample data!");
        System.out.println("📚 Created 4 rooms (A, B, C, D) with 15 tables each");
        System.out.println("👥 Created 2 students with complete information");
        System.out.println("💰 Created payment records");
        System.out.println("🪑 Assigned students to tables");
    }
}
