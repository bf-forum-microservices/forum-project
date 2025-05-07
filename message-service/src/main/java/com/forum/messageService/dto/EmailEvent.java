package com.forum.messageService.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmailEvent {
    private String to;
    private String subject;
    private String body;
}
