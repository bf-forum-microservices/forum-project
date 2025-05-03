package com.forum.authService.Controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/test")
public class AuthController {
    @GetMapping
    public String testAuth() {
        return "✅ Auth Service is working through API Gateway!";
    }
}
