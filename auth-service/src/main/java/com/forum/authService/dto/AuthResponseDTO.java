package com.forum.authService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private Long userId;
    private String email;
    private String role;
    private String token;

//    public AuthResponseDTO(String token) {
//        this.token = token;
//    }
}
