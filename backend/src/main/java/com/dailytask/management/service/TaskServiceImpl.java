package com.dailytask.management.service;

import com.dailytask.management.dto.DashboardStatsDto;
import com.dailytask.management.dto.TaskRequestDto;
import com.dailytask.management.dto.TaskResponseDto;
import com.dailytask.management.entity.Task;
import com.dailytask.management.exception.BadRequestException;
import com.dailytask.management.exception.ResourceNotFoundException;
import com.dailytask.management.repository.TaskRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getAllTasks(String search, String status, String priority, String category,
                                             String filterType, String sortBy, String sortDirection) {
        LocalDate today = LocalDate.now();

        // 1. Determine sort direction and property
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String sortField = "createdAt";
        if ("dueDate".equalsIgnoreCase(sortBy) || "due_date".equalsIgnoreCase(sortBy)) {
            sortField = "dueDate";
        } else if ("priority".equalsIgnoreCase(sortBy)) {
            sortField = "priority";
        } else if ("title".equalsIgnoreCase(sortBy)) {
            sortField = "title";
        } else if ("status".equalsIgnoreCase(sortBy)) {
            sortField = "status";
        }

        Sort sort = Sort.by(direction, sortField);

        // Normalize filter parameters
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String statusParam = (status != null && !status.trim().isEmpty() && !"all".equalsIgnoreCase(status)) ? status.trim() : null;
        String priorityParam = (priority != null && !priority.trim().isEmpty() && !"all".equalsIgnoreCase(priority)) ? priority.trim() : null;
        String categoryParam = (category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category)) ? category.trim() : null;

        List<Task> tasks;

        // Quick special filters
        if ("today".equalsIgnoreCase(filterType)) {
            tasks = taskRepository.findTodayTasks(today);
        } else if ("overdue".equalsIgnoreCase(filterType)) {
            tasks = taskRepository.findOverdueTasks(today);
        } else if ("upcoming".equalsIgnoreCase(filterType)) {
            tasks = taskRepository.findUpcomingTasks(today);
        } else if ("completed".equalsIgnoreCase(filterType)) {
            tasks = taskRepository.findByStatusIgnoreCase("Completed", sort);
        } else {
            tasks = taskRepository.searchAndFilterTasks(searchParam, statusParam, priorityParam, categoryParam, sort);
        }

        // Apply custom priority sorting if requested
        if ("priority".equalsIgnoreCase(sortBy)) {
            Map<String, Integer> priorityWeight = Map.of(
                    "high", 3,
                    "medium", 2,
                    "low", 1
            );
            Comparator<Task> comp = Comparator.comparingInt(t ->
                    priorityWeight.getOrDefault(t.getPriority().toLowerCase(), 0)
            );
            if (!"asc".equalsIgnoreCase(sortDirection)) {
                comp = comp.reversed();
            }
            tasks = tasks.stream().sorted(comp).collect(Collectors.toList());
        }

        return tasks.stream()
                .map(TaskResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponseDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return TaskResponseDto.fromEntity(task);
    }

    @Override
    public TaskResponseDto createTask(TaskRequestDto dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Task title is required");
        }

        Task task = new Task();
        task.setTitle(dto.getTitle().trim());
        task.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
        task.setCategory(dto.getCategory() != null && !dto.getCategory().trim().isEmpty() ? dto.getCategory().trim() : "Other");
        task.setPriority(dto.getPriority() != null && !dto.getPriority().trim().isEmpty() ? normalizePriority(dto.getPriority()) : "Medium");
        task.setDueDate(dto.getDueDate());
        task.setStatus(dto.getStatus() != null && !dto.getStatus().trim().isEmpty() ? normalizeStatus(dto.getStatus()) : "Pending");

        Task saved = taskRepository.save(task);
        return TaskResponseDto.fromEntity(saved);
    }

    @Override
    public TaskResponseDto updateTask(Long id, TaskRequestDto dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (dto.getTitle() != null && !dto.getTitle().trim().isEmpty()) {
            task.setTitle(dto.getTitle().trim());
        }
        task.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);

        if (dto.getCategory() != null && !dto.getCategory().trim().isEmpty()) {
            task.setCategory(dto.getCategory().trim());
        }
        if (dto.getPriority() != null && !dto.getPriority().trim().isEmpty()) {
            task.setPriority(normalizePriority(dto.getPriority()));
        }
        task.setDueDate(dto.getDueDate());

        if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
            task.setStatus(normalizeStatus(dto.getStatus()));
        }

        Task updated = taskRepository.save(task);
        return TaskResponseDto.fromEntity(updated);
    }

    @Override
    public TaskResponseDto updateTaskStatus(Long id, String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (status == null || status.trim().isEmpty()) {
            throw new BadRequestException("Status cannot be blank");
        }

        task.setStatus(normalizeStatus(status));
        Task updated = taskRepository.save(task);
        return TaskResponseDto.fromEntity(updated);
    }

    @Override
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        taskRepository.delete(task);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        LocalDate today = LocalDate.now();

        long total = taskRepository.count();
        long pending = taskRepository.countByStatusIgnoreCase("Pending");
        long inProgress = taskRepository.countByStatusIgnoreCase("In Progress");
        long completed = taskRepository.countByStatusIgnoreCase("Completed");
        long overdue = taskRepository.countOverdueTasks(today);
        long todayCount = taskRepository.countTodayTasks(today);

        double percentage = total > 0 ? Math.round(((double) completed / total) * 1000.0) / 10.0 : 0.0;

        // Priority breakdown
        Map<String, Long> priorityMap = new LinkedHashMap<>();
        priorityMap.put("High", 0L);
        priorityMap.put("Medium", 0L);
        priorityMap.put("Low", 0L);
        List<Object[]> priorityCounts = taskRepository.countTasksByPriority();
        for (Object[] row : priorityCounts) {
            if (row[0] != null && row[1] != null) {
                String p = row[0].toString();
                priorityMap.put(normalizePriority(p), ((Number) row[1]).longValue());
            }
        }

        // Category breakdown
        Map<String, Long> categoryMap = new LinkedHashMap<>();
        List<Object[]> categoryCounts = taskRepository.countTasksByCategory();
        for (Object[] row : categoryCounts) {
            if (row[0] != null && row[1] != null) {
                categoryMap.put(row[0].toString(), ((Number) row[1]).longValue());
            }
        }

        return new DashboardStatsDto(
                total,
                pending,
                inProgress,
                completed,
                overdue,
                todayCount,
                percentage,
                priorityMap,
                categoryMap
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getTodayTasks() {
        return taskRepository.findTodayTasks(LocalDate.now())
                .stream()
                .map(TaskResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getOverdueTasks() {
        return taskRepository.findOverdueTasks(LocalDate.now())
                .stream()
                .map(TaskResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getUpcomingTasks() {
        return taskRepository.findUpcomingTasks(LocalDate.now())
                .stream()
                .map(TaskResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void seedSampleData() {
        LocalDate today = LocalDate.now();
        List<Task> sampleTasks = List.of(
                new Task("Complete college assignment", "Finish and submit the pending software engineering assignment and slides.", "Study", "High", today, "Pending"),
                new Task("Prepare for semester examination", "Revise database management systems, data structures, and algorithms chapters.", "Study", "High", today.plusDays(2), "In Progress"),
                new Task("Review project documentation", "Review API specifications, database ER diagram, and deployment instructions.", "Work", "Medium", today.plusDays(4), "Pending"),
                new Task("Organize daily study schedule", "Plan timetable for the upcoming week focusing on coding and mock interviews.", "Personal", "Low", today.plusDays(1), "Completed"),
                new Task("Design wireframes for mobile UI", "Create responsive wireframes and layout prototypes for mobile viewport.", "Work", "Medium", today.plusDays(5), "Pending"),
                new Task("Buy weekly groceries & supplies", "Purchase fresh vegetables, fruits, and desk essentials for the home office.", "Personal", "Low", today.minusDays(1), "Pending")
        );
        taskRepository.saveAll(sampleTasks);
    }

    private String normalizePriority(String priority) {
        if (priority == null) return "Medium";
        String p = priority.trim().toLowerCase();
        if (p.equals("high")) return "High";
        if (p.equals("low")) return "Low";
        return "Medium";
    }

    private String normalizeStatus(String status) {
        if (status == null) return "Pending";
        String s = status.trim().toLowerCase();
        if (s.equals("completed")) return "Completed";
        if (s.equals("in progress") || s.equals("in_progress") || s.equals("inprogress")) return "In Progress";
        return "Pending";
    }
}
