package com.libraryms.lms.repository;

import com.libraryms.lms.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    // Example custom query if needed:
    // Optional<Student> findByEmail(String email);
}
