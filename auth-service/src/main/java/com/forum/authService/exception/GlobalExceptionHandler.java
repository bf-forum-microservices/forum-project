package com.forum.authService.exception;

import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<String> handleUserNotFound(FeignException.NotFound ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email not registered.");
    }

    @ExceptionHandler(FeignException.Unauthorized.class)
    public ResponseEntity<String> handleInvalidPassword(FeignException.Unauthorized ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password.");
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<String> handleGenericFeignException(FeignException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed due to service error.");
    }
}
