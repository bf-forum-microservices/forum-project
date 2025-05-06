package com.forum.userservice.dto;

import lombok.Data;

@Data
public class ContactUsRequestDTO {
    private String subject;
    private String message;
}
