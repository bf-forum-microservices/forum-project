package com.forum.messageService.controller;

import com.forum.messageService.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/messages")
public class MessageController {

//    @GetMapping("/all")
//    public ResponseEntity<MessageResponse> getAllMessages() {
//        return ResponseEntity.
//    }

    @GetMapping("/all")
    public String getAllMessages() {
        return "All Messages";
    }

    @GetMapping("/{id}")
    public String getMessageById(@PathVariable Integer messageId) {
        return "Message Id: " + messageId;
    }

}
