package com.forum.userservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmailPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void sendVerificationEmail(String email, String token) {
        Map<String, String> message = new HashMap<>();
        message.put("email", email);
        message.put("token", token);

        rabbitTemplate.convertAndSend("emailExchange", "email.verification", message);
    }
}
