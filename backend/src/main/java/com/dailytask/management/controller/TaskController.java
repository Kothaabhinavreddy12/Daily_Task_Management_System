package com.dailytask.management.controller;

import com.dailytask.management.dto.*;
import com.dailytask.management.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Get all tasks with optional search, filters, and sorting.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponseDto>>> getAllTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String filterType,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDirection
    ) {
        List<TaskResponseDto> tasks = taskService.getAllTasks(search, status, priority, category, filterType, sortBy, sortDirection);
        return ResponseEntity.ok(ApiResponse.ok("Tasks retrieved successfully", tasks));
    }

    /**
     * Get a single task by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDto>> getTaskById(@PathVariable Long id) {
        TaskResponseDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.ok("Task retrieved successfully", task));
    }

    /**
     * Create a new task.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponseDto>> createTask(@Valid @RequestBody TaskRequestDto dto) {
        TaskResponseDto created = taskService.createTask(dto);
        return new ResponseEntity<>(ApiResponse.ok("Task created successfully", created), HttpStatus.CREATED);
    }

    /**
     * Update an existing task.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDto>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDto dto
    ) {
        TaskResponseDto updated = taskService.updateTask(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Task updated successfully", updated));
    }

    /**
     * Update task status (Pending, In Progress, Completed).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponseDto>> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDto dto
    ) {
        TaskResponseDto updated = taskService.updateTaskStatus(id, dto.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Task status updated successfully", updated));
    }

    /**
     * Delete a task by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.ok("Task deleted successfully", null));
    }

    /**
     * Get dashboard summary statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto stats = taskService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved successfully", stats));
    }

    /**
     * Get today's tasks.
     */
    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<TaskResponseDto>>> getTodayTasks() {
        List<TaskResponseDto> tasks = taskService.getTodayTasks();
        return ResponseEntity.ok(ApiResponse.ok("Today's tasks retrieved successfully", tasks));
    }

    /**
     * Get overdue tasks.
     */
    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<TaskResponseDto>>> getOverdueTasks() {
        List<TaskResponseDto> tasks = taskService.getOverdueTasks();
        return ResponseEntity.ok(ApiResponse.ok("Overdue tasks retrieved successfully", tasks));
    }

    /**
     * Get upcoming tasks.
     */
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<TaskResponseDto>>> getUpcomingTasks() {
        List<TaskResponseDto> tasks = taskService.getUpcomingTasks();
        return ResponseEntity.ok(ApiResponse.ok("Upcoming tasks retrieved successfully", tasks));
    }

    /**
     * Seed or reset sample tasks.
     */
    @PostMapping("/seed")
    public ResponseEntity<ApiResponse<String>> seedSampleData() {
        taskService.seedSampleData();
        return ResponseEntity.ok(ApiResponse.ok("Sample tasks seeded successfully", "OK"));
    }
}
