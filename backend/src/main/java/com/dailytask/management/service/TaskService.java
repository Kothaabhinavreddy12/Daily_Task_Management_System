package com.dailytask.management.service;

import com.dailytask.management.dto.DashboardStatsDto;
import com.dailytask.management.dto.TaskRequestDto;
import com.dailytask.management.dto.TaskResponseDto;

import java.util.List;

public interface TaskService {

    List<TaskResponseDto> getAllTasks(String search, String status, String priority, String category,
                                     String filterType, String sortBy, String sortDirection);

    TaskResponseDto getTaskById(Long id);

    TaskResponseDto createTask(TaskRequestDto dto);

    TaskResponseDto updateTask(Long id, TaskRequestDto dto);

    TaskResponseDto updateTaskStatus(Long id, String status);

    void deleteTask(Long id);

    DashboardStatsDto getDashboardStats();

    List<TaskResponseDto> getTodayTasks();

    List<TaskResponseDto> getOverdueTasks();

    List<TaskResponseDto> getUpcomingTasks();

    void seedSampleData();
}
