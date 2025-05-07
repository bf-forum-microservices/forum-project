package com.forum.messageService.exception;

public class MessageNotFoundException extends RuntimeException {
    public MessageNotFoundException(Integer messageId) {
        super("Message with ID " + messageId + " not found.");
    }
}