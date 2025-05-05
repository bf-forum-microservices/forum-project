package com.example.postreplyservice.Repository;

import com.example.postreplyservice.Entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByIsArchivedFalse();

    List<Post> findByIsArchivedTrue();

    List<Post> findByUserId(Long userId);

    List<Post> findByStatus(String status);
}
