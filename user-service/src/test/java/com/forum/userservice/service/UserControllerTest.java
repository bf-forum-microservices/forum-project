package com.forum.userservice.service;

import com.forum.userservice.controller.UserController;
import com.forum.userservice.dto.*;
import com.forum.userservice.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    private static final String TEST_SECRET = "mySuperSecretKey1234567890abcdefghigk"; // >= 32 bytes
    private Key key;
    private String jwt;

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes());
        jwt = "Bearer " + Jwts.builder()
                .setSubject("user@example.com")
                .claim("role", "USER")
                .setIssuedAt(new Date())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // Inject test secret manually
        userController = new UserController(userService);
        setField(userController, "jwtSecret", TEST_SECRET);
    }

    private void setField(Object target, String fieldName, Object value) {
        try {
            var field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void updateProfile_shouldCallService() {
        UpdateProfileRequestDTO dto = new UpdateProfileRequestDTO();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setPassword("newpass");
        dto.setProfileImageURL("url");

        ResponseEntity<?> response = userController.updateProfile(jwt, dto);

        verify(userService).updateProfile(any(UpdateProfileRequestDTO.class));
        assertEquals("Profile updated successfully", response.getBody());
    }

    @Test
    void updateEmail_shouldCallService() {
        UpdateEmailRequestDTO dto = new UpdateEmailRequestDTO();
        dto.setNewEmail("new@example.com");

        ResponseEntity<String> response = userController.updateEmail(jwt, dto);

        verify(userService).requestEmailUpdate(eq("user@example.com"), eq("new@example.com"));
        assertEquals("Verification code sent to new email.", response.getBody());
    }

    @Test
    void verifyUpdateEmailCode_shouldCallService() {
        VerifyUpdateEmailCodeRequestDTO dto = new VerifyUpdateEmailCodeRequestDTO();
        dto.setCode("123456");

        ResponseEntity<String> response = userController.verifyUpdateEmailCode(jwt, dto);

        verify(userService).confirmEmailUpdate("user@example.com", "123456");
        assertEquals("Email updated successfully.", response.getBody());
    }

    @Test
    void getUserInfo_shouldReturnDTO() {
        UserDTO dto = new UserDTO();
        dto.setEmail("user@example.com");

        when(userService.getUserInfoByEmail("user@example.com")).thenReturn(dto);

        ResponseEntity<UserDTO> response = userController.getUserInfo(jwt);

        assertEquals("user@example.com", response.getBody().getEmail());
    }

    @Test
    void contactUs_shouldCallService() {
        ContactUsRequestDTO dto = new ContactUsRequestDTO();
        dto.setSubject("Help");
        dto.setMessage("Something's wrong!");

        ResponseEntity<String> response = userController.contactUs(jwt, dto);

        verify(userService).processContactMessage("user@example.com", "Help", "Something's wrong!");
        assertEquals("Your message has been received. We'll get back to you soon.", response.getBody());
    }
}
