//package com.forum.userservice.service;
//
//import com.forum.userservice.service.EmailPublisher;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//
//import java.util.Map;
//
//import static org.mockito.Mockito.*;
//import static org.junit.jupiter.api.Assertions.*;
//import org.junit.jupiter.api.extension.ExtendWith;
//
//@ExtendWith(MockitoExtension.class)
//class EmailPublisherTest {
//
//    @Mock
//    private RabbitTemplate rabbitTemplate;
//
//    @InjectMocks
//    private EmailPublisher emailPublisher;
//
//    @Test
//    void sendVerificationEmail_shouldSendMessageToCorrectExchange() {
//        // Arrange
//        String email = "test@example.com";
//        String token = "123456";
//
//        // Act
//        emailPublisher.sendVerificationEmail(email, token);
//
//        // Assert
//        verify(rabbitTemplate).convertAndSend(
//                eq("emailExchange"),
//                eq("email.verification"),
//                (Object) argThat((Object arg) -> {
//                    if (!(arg instanceof Map)) return false;
//                    Map<?, ?> map = (Map<?, ?>) arg;
//                    return email.equals(map.get("email")) && token.equals(map.get("token"));
//                })
//        );
//    }
//}
