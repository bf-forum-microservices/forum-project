package com.example.historyservice.Repository;

import com.example.historyservice.entity.ViewedPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ViewedPostRepository extends JpaRepository<ViewedPost, Integer> {
    List<ViewedPost> findByUserIdOrderByViewDateDesc(Long userId);
}

