package com.forum.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/admin") // This maps to /users/admin via API Gateway
@RequiredArgsConstructor
public class AdminController {

    // 23. GET all user info + admin
    @GetMapping("/allUserInfo")
    public ResponseEntity<String> getAllUserInfo() {
        // Replace with real service call and return list of user profiles
        return ResponseEntity.ok("Returning all user info including admin");
    }

    // 24. PUT /users/admin/users/{id}/ban
    @PutMapping("/users/{id}/ban")
    public ResponseEntity<String> banUser(@PathVariable String id) {
        // Call service to update user status to BANNED
        return ResponseEntity.ok("User " + id + " has been banned");
    }

    // 25. PUT /users/admin/users/{id}/activate
    @PutMapping("/users/{id}/activate")
    public ResponseEntity<String> activateUser(@PathVariable String id) {
        // Call service to update user status to ACTIVE
        return ResponseEntity.ok("User " + id + " has been activated");
    }
}
