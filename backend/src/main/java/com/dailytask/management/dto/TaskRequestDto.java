package com.dailytask.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class TaskRequestDto {

    @NotBlank(message = "Title is required and cannot be blank")
    @Size(min = 2, max = 255, message = "Title must be between 2 and 255 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category = "Other";

    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "^(?i)(Low|Medium|High)$", message = "Priority must be Low, Medium, or High")
    private String priority = "Medium";

    private LocalDate dueDate;

    @Pattern(regexp = "^(?i)(Pending|In Progress|Completed)$", message = "Status must be Pending, In Progress, or Completed")
    private String status = "Pending";

    public TaskRequestDto() {
    }

    public TaskRequestDto(String title, String description, String category, String priority, LocalDate dueDate, String status) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.dueDate = dueDate;
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
