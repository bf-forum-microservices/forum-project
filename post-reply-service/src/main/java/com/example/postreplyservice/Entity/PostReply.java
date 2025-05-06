package com.example.postreplyservice.Entity;

import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class PostReply {
    private String replyId = UUID.randomUUID().toString();
    private Long userId;
    private String comment;
    private Boolean isActive;
    private Date dateCreated;
    private List<SubReply> subReplies = new ArrayList<>();
}
