package com.forum.messageService.dto;

import java.sql.Timestamp;

import com.forum.messageService.entity.Message;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessageResponse {
    private Integer messageId;
    private Integer userId;
    private String email;
    private String subject;
    private String message;
    private Timestamp dateCreated;
    private Message.Status status;

    public static MessageResponse fromEntity(Message message) {
        return MessageResponse.builder()
                .messageId(message.getMessageId())
                .userId(message.getUserId())
                .email(message.getEmail())
                .subject(message.getSubject())
                .message(message.getMessage())
                .dateCreated(message.getDateCreated())
                .status(message.getStatus())
                .build();
    }

}

