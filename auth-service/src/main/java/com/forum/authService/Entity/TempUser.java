package com.forum.authService.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "tempUserIDs")
public class TempUser {
    @Id
    private String id;
    private String userID;
}
