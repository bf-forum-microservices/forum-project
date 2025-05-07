package com.example.postreplyservice.Entity;

import lombok.Data;
import java.util.Date;
import java.util.UUID;

@Data
public class SubReply {
    private String subReplyId = UUID.randomUUID().toString();
    private Long userId;
    private String comment;
    private Boolean isActive;
    private Date dateCreated;
}
