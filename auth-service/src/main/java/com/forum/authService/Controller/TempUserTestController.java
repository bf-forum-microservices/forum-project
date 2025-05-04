package com.forum.authService.Controller;

import com.forum.authService.Entity.TempUser;
import com.forum.authService.Repository.TempUserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/temp-test")
public class TempUserTestController {

    private final TempUserRepository repository;

    public TempUserTestController(TempUserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public String testTempUserDB() {
        System.out.println("🚀 TempUser DB test endpoint hit!");

        return repository.findAll().stream()
                .findFirst()
                .map(user -> "✅ TempUser DB working! First user: " + user.toString())
                .orElse("⚠️ No TempUser data found in MongoDB.");
    }
}
