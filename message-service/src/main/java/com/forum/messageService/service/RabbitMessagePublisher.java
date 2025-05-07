package com.forum.messageService.service;

import com.forum.messageService.dto.EmailEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RabbitMessagePublisher {

    private final RabbitTemplate rabbitTemplate;

    public RabbitMessagePublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Value("${queue.exchange}")
    private String exchange;

    @Value("${queue.routing-key}")
    private String routingKey;

    public void sendMessageToQueue(EmailEvent emailEvent) {
        rabbitTemplate.convertAndSend(exchange, routingKey, emailEvent);
    }
}
