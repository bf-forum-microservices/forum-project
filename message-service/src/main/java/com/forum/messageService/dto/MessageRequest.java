package com.forum.messageService.dto;

import com.forum.messageService.entity.Message;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Builder
public class MessageRequest {

    private Integer userId;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Subject is required")
    @Size(min = 5, message = "Subject must be at least 5 characters")
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(min = 5, message = "Message must be at least 5 characters")
    private String message;

    public static MessageResponse fromEntity(Message message) {
        return MessageResponse.builder()
                .userId(message.getUserId())
                .email(message.getEmail())
                .subject(message.getSubject())
                .message(message.getMessage())
                .build();
    }
}
