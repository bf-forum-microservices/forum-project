package com.forum.userservice.controller;

import com.forum.userservice.dto.UserDTO;
import com.forum.userservice.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/admin") // This maps to /users/admin via API Gateway
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    @Value("${jwt.secret}")
    private String jwtSecret;

    // 23. GET all user info + admin
    @GetMapping("/allUserInfo")
    public ResponseEntity<List<UserDTO>> getAllUserInfo(@RequestHeader("Authorization") String authHeader) {
        // Replace with real service call and return list of user profiles
        // Extract JWT token
        String token = authHeader.substring(7); // Remove "Bearer "
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        String role = claims.get("role", String.class);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            System.out.println("role " + role);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        List<UserDTO> allUsers = userService.getAllUserInfo();
        return ResponseEntity.ok(allUsers);
    }

    // 24. PUT /users/admin/users/{id}/ban
    @PutMapping("/users/{id}/ban")
    public ResponseEntity<String> banUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        String token = authHeader.substring(7); // Remove "Bearer "
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        String role = claims.get("role", String.class);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can ban users.");
        }

        boolean success = userService.banUserById(id);

        if (!success) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or already banned.");
        }
        return ResponseEntity.ok("User " + id + " has been banned");
    }

    // 25. PUT /users/admin/users/{id}/activate
    @PutMapping("/users/{id}/activate")
    public ResponseEntity<String> activateUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        String token = authHeader.substring(7); // Remove "Bearer "
        System.out.println("wg" + token);
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        String role = claims.get("role", String.class);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can active users.");
        }

        boolean success = userService.activeUserById(id);

        if (!success) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or already activated(not banned).");
        }
        return ResponseEntity.ok("User " + id + " has been activated");
    }

    public void overrideJwtSecretForTest(String jwtSecretForTest) {
        this.jwtSecret = jwtSecretForTest;
    }
}
