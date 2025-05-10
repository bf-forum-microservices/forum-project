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

    @PostMapping("/newPost")
    public Post createPost(@RequestBody Post post) {
        post.setDateCreated(new Date());
        post.setDateModified(new Date());
        if (post.getIsArchived() == null) post.setIsArchived(false);
        if (post.getStatus() == null) post.setStatus("PUBLISHED");
        return postRepository.save(post);
    }

    @PostMapping("/draftPost")
    public Post createDraft(@RequestBody Post post) {
        post.setDateCreated(new Date());
        post.setDateModified(new Date());
        post.setIsArchived(false);
        post.setStatus("DRAFT");
        return postRepository.save(post);
    }

    @GetMapping("/posts/published")
    public List<Post> getAllPublishedPosts() {
        return postRepository.findByStatus("PUBLISHED");
    }

    @GetMapping("/viewPosts")
    public List<Post> getViewedPosts() {
        return postRepository.findByIsArchivedFalse();
    }

    @GetMapping("/userAllposts/{userId}")
    public List<Post> getUserPosts(@PathVariable Long userId) {
        return postRepository.findByUserId(userId);
    }

    @GetMapping("/singlePosts/{id}")
    public Optional<Post> getPostDetails(@PathVariable String id) {
        return postRepository.findById(id);
    }

    @PostMapping("/posts/{id}/replies")
    public Post addReply(@PathVariable String id, @RequestBody PostReply reply) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            if (Boolean.TRUE.equals(post.getIsArchived())) {
                throw new RuntimeException("Cannot comment on an archived post.");
            }
            reply.setDateCreated(new Date());
            post.getPostReplies().add(reply);
            return postRepository.save(post);
        }
        throw new RuntimeException("Post not found");
    }

    @PostMapping("/replies/{id}/sub-replies")
    public Post addSubReply(@PathVariable String id, @RequestBody SubReply subReply) {
        for (Post post : postRepository.findAll()) {
            if (Boolean.TRUE.equals(post.getIsArchived())) continue;
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

    @GetMapping("/posts/user/{userId}")
    public List<Post> getUserPostsByStatus(@PathVariable Long userId, @RequestParam String status) {
        return postRepository.findByUserIdAndStatus(userId, status.toUpperCase());
    }

    @GetMapping("/posts/top/{userId}")
    public List<Post> getTop3PostsByReplyCount(@PathVariable Long userId) {
        return postRepository.findByUserId(userId).stream()
                .filter(post -> "PUBLISHED".equalsIgnoreCase(post.getStatus()) && !Boolean.TRUE.equals(post.getIsArchived()) && post.getPostReplies() != null)
                .sorted((p1, p2) -> Integer.compare(p2.getPostReplies().size(), p1.getPostReplies().size()))
                .limit(3)
                .toList();
    }

    @GetMapping("/admin/userAllposts")
    public List<Post> getAllNonDraftPostsForAdmin(@RequestParam String status) {
        if (status.equalsIgnoreCase("deleted")) {
            return postRepository.findByStatus("DELETED");
        } else {
            return postRepository.findByStatus(status.toUpperCase()).stream()
                    .filter(post -> !"DRAFT".equalsIgnoreCase(post.getStatus()))
                    .toList();
        }
    }

    @PutMapping("/posts/{id}/hide")
    public Post hidePost(@PathVariable String id) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setStatus("HIDDEN");
        return postRepository.save(post);
    }

    @PutMapping("/posts/{id}/unhide")
    public Post unhidePost(@PathVariable String id) {
        Post post = postRepository.findById(id).orElseThrow();
        if ("HIDDEN".equals(post.getStatus())) {
            post.setStatus("PUBLISHED");
        }
        return postRepository.save(post);
    }

    @PutMapping("/admin/posts/{id}/ban")
    public Post banPost(@PathVariable String id) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setStatus("BANNED");
        return postRepository.save(post);
    }

    @PutMapping("/admin/posts/{id}/unban")
    public Post unbanPost(@PathVariable String id) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setStatus("PUBLISHED");
        return postRepository.save(post);
    }

    @GetMapping("/admin/posts/banned")
    public List<Post> getBannedPosts() {
        return postRepository.findByStatus("BANNED");
    }

    @GetMapping("/admin/posts/deleted")
    public List<Post> getDeletedPosts() {
        return postRepository.findByStatus("DELETED");
    }

    @PutMapping("/admin/posts/{id}/recover")
    public Post recoverPost(@PathVariable String id) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setStatus("PUBLISHED");
        return postRepository.save(post);
    }

    @PutMapping("/posts/{id}/delete")
    public ResponseEntity<String> softDeletePost(@PathVariable String id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        }
        Post post = postOptional.get();
        post.setStatus("DELETED");
        post.setDateModified(new Date());
        postRepository.save(post);
        return ResponseEntity.ok("Post soft-deleted (status = DELETED).");
    }

    @PutMapping("/posts/{id}/archive")
    public ResponseEntity<String> setArchivedTrue(@PathVariable String id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        }
        Post post = postOptional.get();
        post.setIsArchived(true);
        post.setDateModified(new Date());
        postRepository.save(post);
        return ResponseEntity.ok("Post archived (isArchived = true).");
    }

    @PutMapping("/posts/{id}/unarchive")
    public ResponseEntity<String> setArchivedFalse(@PathVariable String id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        }
        Post post = postOptional.get();
        post.setIsArchived(false);
        post.setDateModified(new Date());
        postRepository.save(post);
        return ResponseEntity.ok("Post unarchived (isArchived = false).");
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
        if (updatedData.getTitle() != null) existingPost.setTitle(updatedData.getTitle());
        if (updatedData.getContent() != null) existingPost.setContent(updatedData.getContent());
        if (updatedData.getImages() != null) existingPost.setImages(updatedData.getImages());
        if (updatedData.getAttachments() != null) existingPost.setAttachments(updatedData.getAttachments());
        if (updatedData.getStatus() != null) {
            String newStatus = updatedData.getStatus().toUpperCase();
            String currentStatus = existingPost.getStatus();
            if ("DRAFT".equals(currentStatus) && "PUBLISHED".equals(newStatus)) {
                existingPost.setStatus("PUBLISHED");
            } else if (!newStatus.equals(currentStatus)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Status can only be changed from DRAFT to PUBLISHED.");
            }
        }
        existingPost.setDateModified(new Date());
        postRepository.save(existingPost);
        return ResponseEntity.ok("Post updated successfully.");
    }
}
