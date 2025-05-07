package com.forum.messageService.exception;

public class InvalidStatusException extends RuntimeException {
    public InvalidStatusException(String status, String message) {
        super("Invalid status: " + status + ". " + message);
    }
}
