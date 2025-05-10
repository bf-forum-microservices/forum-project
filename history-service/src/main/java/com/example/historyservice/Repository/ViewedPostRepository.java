package com.example.historyservice.Repository;

import com.example.historyservice.entity.ViewedPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ViewedPostRepository extends JpaRepository<ViewedPost, Integer> {
    List<ViewedPost> findByUserIdOrderByViewDateDesc(Long userId);
    Optional<ViewedPost> findByUserIdAndPostId(Long userId, String postId);
}

