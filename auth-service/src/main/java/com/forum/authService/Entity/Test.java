package com.forum.authService.Entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "user")
public class Test {

    @Id
    @Column(name = "userId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(name = "firstName")
    private String firstName;

    @Column(name = "lastName")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "dateJoined")
    @Temporal(TemporalType.DATE)
    private Date dateJoined;

    @Column(name = "type")
    private String type;

    @Column(name = "profileImageURL")
    private String profileImageURL;
}
