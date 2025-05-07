package com.forum.emailService.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailEvent {
    private String to;
    private String subject;
    private String body;
}
