package com.forum.messageService.entity;

import java.sql.Timestamp;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Message {
    private Integer messageId;
    private Integer userId;
    private String email;
    private String subject;
    private String message;
    private Timestamp dateCreated;
    private Status status;

    public enum Status {
        RECEIVED, PROCESSED, RESOLVED
    }
}