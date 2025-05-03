package com.forum.authService.Controller;

//
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
import com.forum.authService.Entity.Test;
import com.forum.authService.Repository.TestRepository;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class AuthTestController {

    private final TestRepository testRepository;

    public AuthTestController(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    @GetMapping
    public String testAuth() {
//        return "✅ Auth Service is working through API Gateway!";
        System.out.println("🛠️ testAuth endpoint was hit!");

        return testRepository.findAll().stream()
                .findFirst()
                //.map(test -> "✅ Auth DB working! ID: " + test.getId() + " Name: " + test.getName())
                .map(test -> "✅ Auth DB working! Test Object: " + test.toString())
                .orElse("⚠️ No data found in DB.");
    }
}
