package com.forum.authService.dto;

import com.forum.authService.Enum.UserRole;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long userId;
    private String email;
    private UserRole type;
    private String token;
}
