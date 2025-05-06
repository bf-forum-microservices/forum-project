package com.forum.userservice.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserIdRequestDTO {
    @NotBlank
    private String userId;
}