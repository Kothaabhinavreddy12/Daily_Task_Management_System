package com.dailytask.management;

import com.dailytask.management.dto.DashboardStatsDto;
import com.dailytask.management.dto.TaskRequestDto;
import com.dailytask.management.dto.TaskResponseDto;
import com.dailytask.management.entity.Task;
import com.dailytask.management.repository.TaskRepository;
import com.dailytask.management.service.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DailyTaskApplicationTests {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        sampleTask = new Task(
                "Complete college assignment",
                "Finish assignment documentation",
                "Study",
                "High",
                LocalDate.now(),
                "Pending"
        );
        sampleTask.setId(1L);
    }

    @Test
    void testCreateTaskSuccess() {
        TaskRequestDto request = new TaskRequestDto(
                "New Task",
                "Task description",
                "Work",
                "Medium",
                LocalDate.now().plusDays(2),
                "Pending"
        );

        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskResponseDto response = taskService.createTask(request);

        assertNotNull(response);
        assertEquals(sampleTask.getTitle(), response.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void testGetTaskById() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));

        TaskResponseDto response = taskService.getTaskById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Complete college assignment", response.getTitle());
    }

    @Test
    void testUpdateTaskStatus() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskResponseDto response = taskService.updateTaskStatus(1L, "Completed");

        assertNotNull(response);
        assertEquals("Completed", sampleTask.getStatus());
        verify(taskRepository, times(1)).save(sampleTask);
    }

    @Test
    void testDeleteTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        doNothing().when(taskRepository).delete(sampleTask);

        assertDoesNotThrow(() -> taskService.deleteTask(1L));
        verify(taskRepository, times(1)).delete(sampleTask);
    }

    @Test
    void testGetDashboardStats() {
        when(taskRepository.count()).thenReturn(10L);
        when(taskRepository.countByStatusIgnoreCase("Pending")).thenReturn(4L);
        when(taskRepository.countByStatusIgnoreCase("In Progress")).thenReturn(3L);
        when(taskRepository.countByStatusIgnoreCase("Completed")).thenReturn(3L);
        when(taskRepository.countOverdueTasks(any(LocalDate.class))).thenReturn(1L);
        when(taskRepository.countTodayTasks(any(LocalDate.class))).thenReturn(2L);
        when(taskRepository.countTasksByPriority()).thenReturn(Collections.emptyList());
        when(taskRepository.countTasksByCategory()).thenReturn(Collections.emptyList());

        DashboardStatsDto stats = taskService.getDashboardStats();

        assertNotNull(stats);
        assertEquals(10L, stats.getTotalTasks());
        assertEquals(4L, stats.getPendingTasks());
        assertEquals(3L, stats.getCompletedTasks());
        assertEquals(30.0, stats.getCompletionPercentage());
    }
}
