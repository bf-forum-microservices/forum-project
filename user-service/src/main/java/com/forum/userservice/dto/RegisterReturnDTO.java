package com.forum.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
public class RegisterReturnDTO {
    private String firstName;
    private String lastName;
    private String email;
}
