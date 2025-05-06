package com.example.historyservice.controller;

import com.example.historyservice.entity.ViewedPost;
import com.example.historyservice.Repository.ViewedPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/history")
public class HistoryController {

    @Autowired
    private ViewedPostRepository repository;

    // GET /history/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserHistory(@PathVariable Long userId) {
        List<ViewedPost> history = repository.findByUserIdOrderByViewDateDesc(userId);
        return ResponseEntity.ok(history);
    }

    // POST /history/{userId}?postId=123
    @PostMapping("/{userId}")
    public ResponseEntity<?> addHistory(@PathVariable Long userId,
                                        @RequestParam String postId) {
        try {
            ViewedPost viewedPost = new ViewedPost();
            viewedPost.setUserId(userId);
            viewedPost.setPostId(postId);
            viewedPost.setViewDate(new Date());
            repository.save(viewedPost);
            return ResponseEntity.ok("History added.");
        } catch (Exception e) {
            e.printStackTrace(); // 关键调试信息
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error saving history: " + e.getMessage());
        }
    }

}



