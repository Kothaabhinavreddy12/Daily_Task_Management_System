package com.dailytask.management.dto;

import java.util.Map;

public class DashboardStatsDto {

    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long overdueTasks;
    private long todayTasks;
    private double completionPercentage;
    private Map<String, Long> priorityBreakdown;
    private Map<String, Long> categoryBreakdown;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalTasks, long pendingTasks, long inProgressTasks, long completedTasks,
                             long overdueTasks, long todayTasks, double completionPercentage,
                             Map<String, Long> priorityBreakdown, Map<String, Long> categoryBreakdown) {
        this.totalTasks = totalTasks;
        this.pendingTasks = pendingTasks;
        this.inProgressTasks = inProgressTasks;
        this.completedTasks = completedTasks;
        this.overdueTasks = overdueTasks;
        this.todayTasks = todayTasks;
        this.completionPercentage = completionPercentage;
        this.priorityBreakdown = priorityBreakdown;
        this.categoryBreakdown = categoryBreakdown;
    }

    // Getters and Setters

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public long getTodayTasks() {
        return todayTasks;
    }

    public void setTodayTasks(long todayTasks) {
        this.todayTasks = todayTasks;
    }

    public double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public Map<String, Long> getPriorityBreakdown() {
        return priorityBreakdown;
    }

    public void setPriorityBreakdown(Map<String, Long> priorityBreakdown) {
        this.priorityBreakdown = priorityBreakdown;
    }

    public Map<String, Long> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
