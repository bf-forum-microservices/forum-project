package com.forum.messageService.entity;

import java.sql.Timestamp;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;

@Entity
@Table(name = "Message")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Integer messageId;

    @Column(nullable = false)
    private Integer userId;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String subject;

    @Column(nullable = false)
    private String message;

    @Column
    private Timestamp dateCreated;

    @Enumerated(EnumType.STRING)
    @Column
    private Status status;

    @PrePersist
    public void prePersist() {
        // Set default status if not provided
        if (this.status == null) {
            this.status = Status.RECEIVED;
        }

        // Set the current timestamp if dateCreated is null
        if (this.dateCreated == null) {
            this.dateCreated = new Timestamp(System.currentTimeMillis());
        }
    }

    public enum Status {
        RECEIVED, PROCESSED, RESOLVED
    }
}