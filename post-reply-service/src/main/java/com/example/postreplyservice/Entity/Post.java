package com.example.postreplyservice.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String postId = UUID.randomUUID().toString();

    private Long userId;
    private String userName;
    private String profileImageURL;
    private String title;
    private String content;
    private Boolean isArchived;
    private String status;
    private Date dateCreated;
    private Date dateModified;
    private List<String> images;
    private List<String> attachments;
    private List<PostReply> postReplies = new ArrayList<>();;
}
