package com.forum.userservice.dto;
import lombok.Data;

@Data
public class UpdateProfileRequestDTO {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String profileImageURL;
    // Add any other fields you want to allow updates for
}
