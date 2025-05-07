package com.forum.emailService.service;

import com.forum.emailService.dto.EmailEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailListener {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @RabbitListener(queues = "${queue.name}")
    public void handleEmailMessage(EmailEvent event) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(event.getTo());
        message.setSubject(event.getSubject());
        message.setText(event.getBody());

        mailSender.send(message);
        System.out.println("Email sent to: " + event.getTo());
    }
}

