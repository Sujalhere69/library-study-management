package com.libraryms.lms.repository; // ✅ your package name

import com.libraryms.lms.model.Room;
import com.libraryms.lms.model.StudyTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyTableRepository extends JpaRepository<StudyTable, Long> {
    
    Optional<StudyTable> findByRoomAndTableNumber(Room room, int tableNumber);
    
    List<StudyTable> findByIsOccupiedFalse();
    
    List<StudyTable> findByRoom(Room room);
}
