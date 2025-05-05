package com.example.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserIdRequestDTO {
    @NotBlank
    private String userId;
}