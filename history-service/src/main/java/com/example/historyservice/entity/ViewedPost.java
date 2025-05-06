package com.example.historyservice.entity;

import javax.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "history")
public class ViewedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "historyId") // 正确字段名
    private Integer historyId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "postId", nullable = false)
    private String postId;

    @Column(name = "viewDate", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date viewDate;
}
