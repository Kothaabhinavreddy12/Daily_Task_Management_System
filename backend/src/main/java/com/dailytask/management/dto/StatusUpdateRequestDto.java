package com.dailytask.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class StatusUpdateRequestDto {

    @NotBlank(message = "Status cannot be blank")
    @Pattern(regexp = "^(?i)(Pending|In Progress|Completed)$", message = "Status must be Pending, In Progress, or Completed")
    private String status;

    public StatusUpdateRequestDto() {
    }

    public StatusUpdateRequestDto(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
