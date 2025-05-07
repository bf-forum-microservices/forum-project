package com.forum.emailService;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableRabbit
public class EmailServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmailServiceApplication.class, args);
    }

}
