package com.dailytask.management.repository;

import com.dailytask.management.entity.Task;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE " +
           "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR (t.description IS NOT NULL AND LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))) " +
           "AND (:status IS NULL OR LOWER(t.status) = LOWER(:status)) " +
           "AND (:priority IS NULL OR LOWER(t.priority) = LOWER(:priority)) " +
           "AND (:category IS NULL OR LOWER(t.category) = LOWER(:category))")
    List<Task> searchAndFilterTasks(
            @Param("keyword") String keyword,
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("category") String category,
            Sort sort
    );

    @Query("SELECT t FROM Task t WHERE t.dueDate = :date ORDER BY t.createdAt DESC")
    List<Task> findTodayTasks(@Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.dueDate < :date AND LOWER(t.status) != 'completed' ORDER BY t.dueDate ASC")
    List<Task> findOverdueTasks(@Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.dueDate >= :date AND LOWER(t.status) != 'completed' ORDER BY t.dueDate ASC")
    List<Task> findUpcomingTasks(@Param("date") LocalDate date);

    List<Task> findByStatusIgnoreCase(String status, Sort sort);

    long countByStatusIgnoreCase(String status);

    long countByDueDate(LocalDate dueDate);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :date AND LOWER(t.status) != 'completed'")
    long countOverdueTasks(@Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate = :date")
    long countTodayTasks(@Param("date") LocalDate date);

    @Query("SELECT t.priority, COUNT(t) FROM Task t GROUP BY t.priority")
    List<Object[]> countTasksByPriority();

    @Query("SELECT t.category, COUNT(t) FROM Task t GROUP BY t.category")
    List<Object[]> countTasksByCategory();
}
