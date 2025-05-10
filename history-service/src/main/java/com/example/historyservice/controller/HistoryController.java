package com.example.historyservice.controller;

import com.example.historyservice.entity.ViewedPost;
import com.example.historyservice.Repository.ViewedPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

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
    public ResponseEntity<?> addOrUpdateHistory(@PathVariable Long userId,
                                                @RequestParam String postId) {
        try {
            Optional<ViewedPost> existingRecord = repository.findByUserIdAndPostId(userId, postId);

            if (existingRecord.isPresent()) {
                // 更新已存在记录的 viewDate
                ViewedPost viewedPost = existingRecord.get();
                viewedPost.setViewDate(new Date());
                repository.save(viewedPost);
                return ResponseEntity.ok("History updated.");
            } else {
                // 创建新记录
                ViewedPost viewedPost = new ViewedPost();
                viewedPost.setUserId(userId);
                viewedPost.setPostId(postId);
                viewedPost.setViewDate(new Date());
                repository.save(viewedPost);
                return ResponseEntity.ok("History added.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error saving history: " + e.getMessage());
        }
    }


}



