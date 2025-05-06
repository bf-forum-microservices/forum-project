package com.forum.userservice.dto;

import com.forum.userservice.Enum.UserRole;
import com.forum.userservice.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAuthDTO {
    private Long userId;
    private String email;
    private UserRole type;
    private boolean banned;
}
