package com.forum.messageService.controller;

import com.forum.messageService.dto.MessageRequest;
import com.forum.messageService.entity.Message;
import com.forum.messageService.entity.Message.Status;
import com.forum.messageService.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/admin/messages/all")
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/admin/messages/{messageId}")
    public ResponseEntity<?> getMessageById(@PathVariable("messageId") Integer messageId) {
        Message message = messageService.getMessageById(messageId);
        if (message == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(message);
    }

    @PostMapping("/admin/messages/create")
    public ResponseEntity<String> createMessage(@RequestBody MessageRequest messageRequest) {
        Message message = Message.builder()
                .userId(messageRequest.getUserId())
                .email(messageRequest.getEmail())
                .subject(messageRequest.getSubject())
                .message(messageRequest.getMessage())
                .build();
        messageService.createMessage(message);
        return ResponseEntity.ok("Message created successfully");
    }

    @DeleteMapping("/admin/messages/{messageId}")
    public ResponseEntity<String> deleteMessage(@PathVariable("messageId") Integer messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.ok("Message deleted successfully");
    }

    @PatchMapping("/admin/messages/{messageId}/status")
    public ResponseEntity<String> changeStatus(
            @PathVariable("messageId") Integer messageId,
            @RequestParam("status") String statusString) {
        statusString = statusString.toUpperCase();
        if (statusString.equals("PROCESSED") || statusString.equals("RESOLVED")) {
            messageService.changeMessageStatus(messageId, Status.valueOf(statusString));
        }

        return ResponseEntity.ok("Message status updated to: " + statusString);
    }
}
