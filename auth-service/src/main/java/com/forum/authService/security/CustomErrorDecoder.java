package com.forum.authService.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Response;
import feign.Util;
import feign.codec.ErrorDecoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class CustomErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultDecoder = new Default();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Exception decode(String methodKey, Response response) {
        try {
            String responseBody = Util.toString(response.body().asReader(StandardCharsets.UTF_8));
            Map<String, Object> errorMap = objectMapper.readValue(responseBody, Map.class);

            String errorMessage = (String) errorMap.getOrDefault("message", errorMap.get("error"));

            if (response.status() == HttpStatus.UNAUTHORIZED.value()) {
                return new RuntimeException(errorMessage);
            }

            if (response.status() == HttpStatus.NOT_FOUND.value()) {
                return new RuntimeException(errorMessage);
            }

            if (response.status() == HttpStatus.FORBIDDEN.value()) {
                return new RuntimeException(errorMessage);
            }

            return new RuntimeException(errorMessage);

        } catch (Exception e) {
            return defaultDecoder.decode(methodKey, response);
        }
    }

}
