package com.forum.userservice.repository;

import com.forum.userservice.dto.EmailEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmailPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${queue.exchange}")
    private String exchange;

    @Value("${queue.routing-key}")
    private String routingKey;

    public void sendVerificationEmail(String email, String code) {
        EmailEvent event = EmailEvent.builder()
                .to(email)
                .subject("Verify your email")
                .body("Your verification code is: " + code)
                .build();

        System.out.println("!!!!!!!!!!!!!!!!!!!!!Send to msg");

        rabbitTemplate.convertAndSend(exchange, routingKey, event);
    }
}

