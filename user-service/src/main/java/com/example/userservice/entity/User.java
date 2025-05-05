//package com.example.userservice.entity;
//
//import org.springframework.data.annotation.Id;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//
//import javax.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Data
//@Table(name = "users")
//public class User {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long userId;
//
//    private String firstName;
//
//    private String lastName;
//
//    @Column(unique = true, nullable = false)
//    private String email;
//
//    @Column(nullable = false)
//    private String password;
//
//    private boolean active = false;
//
//    @CreationTimestamp
//    private LocalDateTime dateJoined;
//
//    @Enumerated(EnumType.STRING)
//    private UserRole type = UserRole.USER;
//
//    private String verificationCode;
//
//    // TODO
//    //private String profileImageURL;
//}
