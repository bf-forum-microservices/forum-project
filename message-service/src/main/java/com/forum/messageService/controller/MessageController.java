package com.forum.messageService.controller;

import com.forum.messageService.dto.MessageRequest;
import com.forum.messageService.entity.Message;
import com.forum.messageService.service.MessageService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @GetMapping("/admin/messages/all")
    public ResponseEntity<List<Message>> getAllMessages(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        String role = claims.get("role", String.class);
        if (!"ADMIN".equalsIgnoreCase(role) && !"SUPER_ADMIN".equalsIgnoreCase(role)) {
            System.out.println("role " + role);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        List<Message> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/admin/messages/{messageId}")
    public ResponseEntity<?> getMessageById(@PathVariable("messageId") Integer messageId,
                                            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        String role = claims.get("role", String.class);
        if (!"ADMIN".equalsIgnoreCase(role) && !"SUPER_ADMIN".equalsIgnoreCase(role)) {
            System.out.println("role " + role);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        Message message = messageService.getMessageById(messageId);
        if (message == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(message);
    }

    @PostMapping("/admin/messages/create")
    public ResponseEntity<?> createMessage(@Valid @RequestBody MessageRequest messageRequest,
                                                BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
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
    public ResponseEntity<String> deleteMessage(@PathVariable("messageId") Integer messageId,
                                                @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7); // Remove "Bearer "
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        String role = claims.get("role", String.class);
        if (!"ADMIN".equalsIgnoreCase(role) && !"SUPER_ADMIN".equalsIgnoreCase(role)) {
            System.out.println("role " + role);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        messageService.deleteMessage(messageId);
        return ResponseEntity.ok("Message deleted successfully");
    }

    @PatchMapping("/admin/messages/{messageId}/status")
    public ResponseEntity<String> changeStatus(
            @PathVariable("messageId") Integer messageId,
            @RequestParam("status") String statusString,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7); // Remove "Bearer "
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        String role = claims.get("role", String.class);
        if (!"ADMIN".equalsIgnoreCase(role) && !"SUPER_ADMIN".equalsIgnoreCase(role)) {
            System.out.println("role " + role);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        messageService.changeMessageStatus(messageId, statusString);

        return ResponseEntity.ok("Message status updated to: " + statusString);
    }
}
