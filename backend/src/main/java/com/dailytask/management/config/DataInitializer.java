package com.dailytask.management.config;

import com.dailytask.management.repository.TaskRepository;
import com.dailytask.management.service.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final TaskRepository taskRepository;
    private final TaskService taskService;

    public DataInitializer(TaskRepository taskRepository, TaskService taskService) {
        this.taskRepository = taskRepository;
        this.taskService = taskService;
    }

    @Override
    public void run(String... args) {
        try {
            long count = taskRepository.count();
            if (count == 0) {
                logger.info("Database is empty. Seeding initial sample tasks...");
                taskService.seedSampleData();
                logger.info("Successfully seeded sample tasks!");
            } else {
                logger.info("Database already contains {} tasks. Skipping automatic seeding.", count);
            }
        } catch (Exception e) {
            logger.warn("Could not execute data seeding on startup: {}", e.getMessage());
        }
    }
}
