package com.forum.userservice.controller;

import com.forum.userservice.dto.*;

import javax.validation.Valid;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.http.ResponseEntity;
import com.forum.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    @Value("${jwt.secret}")
    private String jwtSecret;

    @PutMapping("/updateProfile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequestDTO dto) {
        // Remove "Bearer " prefix
        String token = authHeader.substring(7);

        // Parse token
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        String email = claims.getSubject(); // sub
        dto.setEmail(email); // Assuming you remove userId and use email to identify

        userService.updateProfile(dto);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PutMapping("/updateEmail")
    public ResponseEntity<String> updateEmail(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateEmailRequestDTO requestDTO) {
        System.out.println("Header: " + authHeader);
        System.out.println("DTO: " + requestDTO.getNewEmail());
        String token = authHeader.substring(7); // Remove "Bearer "
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();
        String email = claims.getSubject();

        userService.requestEmailUpdate(email, requestDTO.getNewEmail());
        return ResponseEntity.ok("Verification code sent to new email.");
    }

    @PostMapping("/verifyUpdateEmailCode")
    public ResponseEntity<String> verifyUpdateEmailCode(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody VerifyUpdateEmailCodeRequestDTO requestDTO) {
        String token = authHeader.substring(7);
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();
        String email = claims.getSubject();

        userService.confirmEmailUpdate(email, requestDTO.getCode());
        return ResponseEntity.ok("Email updated successfully.");
    }

    @GetMapping("/info")
    public ResponseEntity<UserDTO> getUserInfo(
            @RequestHeader("Authorization") String authHeader) {
        System.out.println("get User Info, Header: " + authHeader);
        // Remove "Bearer " prefix
        String token = authHeader.substring(7);

        // Parse token to get email
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        String email = claims.getSubject();

        // Get user by email
        UserDTO userDTO = userService.getUserInfoByEmail(email);

        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/contactUs")
    public ResponseEntity<String> contactUs(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ContactUsRequestDTO request
    ) {
        // Extract email from token
        String token = authHeader.substring(7);
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        String email = claims.getSubject();

        // Process the message
        userService.processContactMessage(email, request.getSubject(), request.getMessage());

        return ResponseEntity.ok("Your message has been received. We'll get back to you soon.");
    }

}
