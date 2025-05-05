package com.example.postreplyservice.Controller;

import com.example.postreplyservice.Entity.Post;
import com.example.postreplyservice.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.postreplyservice.Entity.PostReply;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/postandreply")
public class PostReplyController {

    @Autowired
    private PostRepository postRepository;

    // 创建新帖子（发布）
    @PostMapping("/newPost")
    public Post createPost(@RequestBody Post post) {
        post.setDateCreated(new Date());
        post.setDateModified(new Date());
        post.setIsArchived(false);
        post.setStatus("PUBLISHED");
        return postRepository.save(post);
    }

    // 创建草稿帖子
    @PostMapping("/draftPost")
    public Post createDraft(@RequestBody Post post) {
        post.setDateCreated(new Date());
        post.setDateModified(new Date());
        post.setIsArchived(false);
        post.setStatus("DRAFT");
        return postRepository.save(post);
    }

    // 获取所有非归档帖子（已发布）
    @GetMapping("/viewPosts")
    public List<Post> getViewedPosts() {
        return postRepository.findByIsArchivedFalse();
    }

    // 获取某个用户的所有帖子
    @GetMapping("/userAllposts/{userId}")
    public List<Post> getUserPosts(@PathVariable Long userId) {
        return postRepository.findByUserId(userId);
    }

    // 获取帖子详情（包括回复）
    @GetMapping("/singlePosts/{id}")
    public Optional<Post> getPostDetails(@PathVariable String id) {
        return postRepository.findById(id);
    }

    // 添加一个回复（PostReply）到帖子
    @PostMapping("/posts/{id}/replies")
    public Post addReply(@PathVariable String id, @RequestBody PostReply reply) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            reply.setDateCreated(new Date());
            post.getPostReplies().add(reply);
            return postRepository.save(post);
        }
        throw new RuntimeException("Post not found");
    }

    // Admin 获取所有帖子
    @GetMapping("/admin/userAllposts")
    public List<Post> getAllPostsForAdmin() {
        return postRepository.findAll();
    }

    // Admin 禁用帖子
    @PutMapping("/admin/posts/{id}/ban")
    public Post banPost(@PathVariable String id) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setStatus("BANNED");
        return postRepository.save(post);
    }

    // Admin 启用帖子
    @PutMapping("/admin/posts/{id}/unban")
    public Post unbanPost(@PathVariable String id) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setStatus("PUBLISHED");
        return postRepository.save(post);
    }

    // Admin 获取所有被禁用的帖子
    @GetMapping("/admin/posts/banned")
    public List<Post> getBannedPosts() {
        return postRepository.findByStatus("BANNED");
    }

    // Admin 获取所有被删除的帖子（假设 isArchived=true 表示删除）
    @GetMapping("/admin/posts/deleted")
    public List<Post> getDeletedPosts() {
        return postRepository.findByIsArchivedTrue();
    }

    // Admin 恢复被删除的帖子
    @PutMapping("/admin/posts/{id}/recover")
    public Post recoverPost(@PathVariable String id) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setIsArchived(false);
        return postRepository.save(post);
    }
}
