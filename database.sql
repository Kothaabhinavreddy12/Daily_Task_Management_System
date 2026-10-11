-- ====================================================================
-- Daily Task Management System - Database Initialization Script
-- Database Name: daily_task_management
-- Table: tasks
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `daily_task_management`
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `daily_task_management`;

-- Drop table if exists for clean recreation if needed
DROP TABLE IF EXISTS `tasks`;

-- Create tasks table
CREATE TABLE `tasks` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'Other',
    `priority` ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    `due_date` DATE NULL,
    `status` ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_tasks_status` (`status`),
    INDEX `idx_tasks_priority` (`priority`),
    INDEX `idx_tasks_category` (`category`),
    INDEX `idx_tasks_due_date` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data Seeding
INSERT INTO `tasks` (`title`, `description`, `category`, `priority`, `due_date`, `status`, `created_at`, `updated_at`) VALUES
('Complete college assignment', 'Finish and submit the pending software engineering assignment and slides.', 'Study', 'High', CURDATE(), 'Pending', NOW(), NOW()),
('Prepare for semester examination', 'Revise database management systems, data structures, and algorithms chapters.', 'Study', 'High', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'In Progress', NOW(), NOW()),
('Review project documentation', 'Review API specifications, database ER diagram, and deployment instructions.', 'Work', 'Medium', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'Pending', NOW(), NOW()),
('Organize daily study schedule', 'Plan timetable for the upcoming week focusing on coding and mock interviews.', 'Personal', 'Low', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Completed', NOW(), NOW()),
('Design wireframes for mobile UI', 'Create responsive wireframes and layout prototypes for mobile viewport.', 'Work', 'Medium', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'Pending', NOW(), NOW()),
('Buy weekly groceries & supplies', 'Purchase fresh vegetables, fruits, and desk essentials for the home office.', 'Personal', 'Low', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Pending', NOW(), NOW());
