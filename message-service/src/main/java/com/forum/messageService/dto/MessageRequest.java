package com.forum.messageService.dto;

import java.sql.Timestamp;

import com.forum.messageService.entity.Message;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessageRequest {
    private Integer userId;
    private String email;
    private String subject;
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

