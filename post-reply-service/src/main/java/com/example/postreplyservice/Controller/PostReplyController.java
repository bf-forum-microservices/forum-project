package com.example.postreplyservice.Controller;

import com.example.postreplyservice.Entity.Post;
import com.example.postreplyservice.Entity.PostReply;
import com.example.postreplyservice.Entity.SubReply;
import com.example.postreplyservice.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

        // 如果前端没传 isArchived 或 status，才设置默认值
        if (post.getIsArchived() == null) {
            post.setIsArchived(false);
        }
        if (post.getStatus() == null) {
            post.setStatus("PUBLISHED");
        }

        return postRepository.save(post);
    }


    @GetMapping("/posts/published")
    public List<Post> getAllPublishedPosts() {
        return postRepository.findByStatus("PUBLISHED");
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

    // ✅ 添加子回复（只支持一层）
    @PostMapping("/replies/{id}/sub-replies")
    public Post addSubReply(@PathVariable String id, @RequestBody SubReply subReply) {
        for (Post post : postRepository.findAll()) {
            for (PostReply reply : post.getPostReplies()) {
                if (reply.getReplyId().equals(id)) {
                    subReply.setDateCreated(new Date());
                    reply.getSubReplies().add(subReply);
                    return postRepository.save(post);
                }
            }
        }
        throw new RuntimeException("Reply not found");
    }


    // ✅ 获取某用户草稿或已发布帖子（通过参数 status 控制）
    @GetMapping("/posts/user/{userId}")
    public List<Post> getUserPostsByStatus(@PathVariable Long userId, @RequestParam String status) {
        return postRepository.findByUserIdAndStatus(userId, status.toUpperCase());
    }

    // ✅ 获取某用户按回复数前 3 的帖子
    @GetMapping("/posts/top/{userId}")
    public List<Post> getTop3PostsByReplyCount(@PathVariable Long userId) {
        return postRepository.findByUserId(userId).stream()
                .filter(post ->
                        "PUBLISHED".equalsIgnoreCase(post.getStatus()) &&
                                !Boolean.TRUE.equals(post.getIsArchived()) &&
                                post.getPostReplies() != null
                )
                .sorted((p1, p2) -> Integer.compare(
                        p2.getPostReplies().size(), p1.getPostReplies().size()))
                .limit(3)
                .toList();
    }


    // Admin 获取所有帖子
    @GetMapping("/admin/userAllposts")
    public List<Post> getAllNonDraftPostsForAdmin(@RequestParam String status) {
        if (status.equalsIgnoreCase("deleted")) {
            return postRepository.findByIsArchivedTrue();
        } else {
            return postRepository.findByStatus(status.toUpperCase()).stream()
                    .filter(post -> !"DRAFT".equalsIgnoreCase(post.getStatus()))
                    .toList();
        }
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

    // Admin 获取所有被删除的帖子
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

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<String> softDeletePost(@PathVariable String id) {
        Optional<Post> postOptional = postRepository.findById(id);

        if (postOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        }

        Post post = postOptional.get();
        if (Boolean.TRUE.equals(post.getIsArchived())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post already deleted.");
        }

        post.setIsArchived(true);
        postRepository.save(post);
        return ResponseEntity.ok("Post soft-deleted.");
    }


    @DeleteMapping("/posts/replies/{replyId}")
    public ResponseEntity<String> deleteReply(@PathVariable String replyId) {
        for (Post post : postRepository.findAll()) {
            List<PostReply> replies = post.getPostReplies();
            if (replies == null) continue;

            boolean removed = replies.removeIf(r -> r.getReplyId().equals(replyId));
            if (removed) {
                postRepository.save(post);
                return ResponseEntity.ok("Reply permanently deleted.");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reply not found.");
    }

    // ✅ 软删除子回复（设置 isActive = false）
    @DeleteMapping("/posts/replies/sub-replies/{subReplyId}")
    public ResponseEntity<String> deleteSubReply(@PathVariable String subReplyId) {
        for (Post post : postRepository.findAll()) {
            List<PostReply> replies = post.getPostReplies();
            if (replies == null) continue;

            for (PostReply reply : replies) {
                List<SubReply> subReplies = reply.getSubReplies();
                if (subReplies == null) continue;

                boolean removed = subReplies.removeIf(s -> s.getSubReplyId().equals(subReplyId));
                if (removed) {
                    postRepository.save(post);
                    return ResponseEntity.ok("Sub-reply permanently deleted.");
                }
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sub-reply not found.");
    }

    @PatchMapping("/posts/{id}")
    public ResponseEntity<String> updatePost(@PathVariable String id, @RequestBody Post updatedData) {
        Optional<Post> postOptional = postRepository.findById(id);

        if (postOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found with ID: " + id);
        }

        Post existingPost = postOptional.get();

        // ✅ 只更新非空字段（部分更新）
        if (updatedData.getTitle() != null) {
            existingPost.setTitle(updatedData.getTitle());
        }

        if (updatedData.getContent() != null) {
            existingPost.setContent(updatedData.getContent());
        }

        if (updatedData.getImages() != null) {
            existingPost.setImages(updatedData.getImages());
        }

        if (updatedData.getAttachments() != null) {
            existingPost.setAttachments(updatedData.getAttachments());
        }

        if (updatedData.getStatus() != null) {
            String newStatus = updatedData.getStatus().toUpperCase();
            String currentStatus = existingPost.getStatus();

            // 只允许 DRAFT → PUBLISHED
            if ("DRAFT".equals(currentStatus) && "PUBLISHED".equals(newStatus)) {
                existingPost.setStatus("PUBLISHED");
            } else if (newStatus.equals(currentStatus)) {
                // 忽略不变的状态
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Status can only be changed from DRAFT to PUBLISHED.");
            }
        }

        // ✅ 系统更新最后修改时间
        existingPost.setDateModified(new Date());

        postRepository.save(existingPost);

        return ResponseEntity.ok("Post updated successfully.");
    }

}
