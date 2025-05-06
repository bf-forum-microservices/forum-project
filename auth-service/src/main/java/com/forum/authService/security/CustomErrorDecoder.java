package com.forum.authService.security;

import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class CustomErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        if (response.status() == HttpStatus.UNAUTHORIZED.value()) {
            return new RuntimeException("Invalid username or password.");
        }
        if (response.status() == HttpStatus.NOT_FOUND.value()) {
            return new RuntimeException("User not found.");
        }
        return defaultDecoder.decode(methodKey, response);
    }
}