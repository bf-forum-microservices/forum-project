package com.forum.userservice.controller;

import com.forum.userservice.dto.*;
import com.forum.userservice.entity.User;
import com.forum.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserAuthController {

    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(UserAuthController.class);

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest){
        RegisterReturnDTO result = userService.registerUser(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyCodeDTO request) {
        log.info(" [UserService] /verify-email hit");

        System.out.println("Enter email");

        boolean success = userService.verifyEmail(request.getEmail(), request.getCode());

        if (!success) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid or expired verification code.");
        }

        return ResponseEntity.ok("Email verified successfully.");
    }


    @PostMapping("/validate")
    public ResponseEntity<UserAuthDTO> validateUser(@RequestBody LoginRequestDTO request) {
        return userService.validateUser(request);
    }


}
