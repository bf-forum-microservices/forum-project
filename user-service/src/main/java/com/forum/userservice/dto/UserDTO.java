package com.forum.userservice.dto;

import com.forum.userservice.Enum.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.forum.userservice.entity.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long userId;
    private String email;
    private UserRole type;
    private String firstName;
    private String lastName;
    private String profileImageURL;

    public UserDTO(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.type = user.getType();
    }
}
