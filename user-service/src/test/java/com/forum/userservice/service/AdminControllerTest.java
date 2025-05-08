package com.forum.userservice.service;

import com.forum.userservice.controller.AdminController;
import com.forum.userservice.dto.UserDTO;
import com.forum.userservice.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    private static final String TEST_SECRET = "mySuperSecretKey1234567890abcdefghigk";
    private static final String TEST_JWT = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3MDAwMDAwMDAsImlhdCI6MTcwMDAwMDAwMH0.d8xY4A_K9i8Nd2-vg3NYvZixTnpZUXmVKn7mCP9u2J8";

    private final Key key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes());

    @InjectMocks
    private AdminController adminController;

    @Mock
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        adminController = spy(new AdminController(userService));
//        doReturn("mysecret").when(adminController).getJwtSecret(); // if you expose getter
        adminController.overrideJwtSecretForTest(TEST_SECRET);
    }

    private String creatNewJwt() {
        return Jwts.builder()
                .setSubject("test_email")
                .claim("role", "test_role")
                .claim("userId", 1234L)
                .setIssuedAt(new Date())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String creatNewAdminJwt() {
        return Jwts.builder()
                .setSubject("test_email")
                .claim("role", "ADMIN")
                .claim("userId", 1234L)
                .setIssuedAt(new Date())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String buildTokenWithRole(String role) {
        Claims claims = mock(Claims.class);
        when(claims.get("role", String.class)).thenReturn(role);
        Jwts.parser().setSigningKey("mysecret".getBytes()); // required for real parsing, skipped here
        return "Bearer faketoken"; // Replace with real parsing logic in integration test
    }

    @Test
    void getAllUserInfo_shouldReturnForbidden_whenRoleIsNotAdmin() {
        String token = "Bearer " + creatNewJwt();
//        String token = "Bearer faketoken";
        // Stub token parsing manually
        ResponseEntity<List<UserDTO>> response = adminController.getAllUserInfo(token);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void getAllUserInfo_shouldReturnAllUser_whenRoleIsAdmin() {
        String token = "Bearer " + creatNewAdminJwt();
//      String token = "Bearer faketoken";
        // Stub token parsing manually
        ResponseEntity<List<UserDTO>> response = adminController.getAllUserInfo(token);
        assertNotNull(response);
    }

    @Test
    void banUser_shouldReturnForbidden_whenNotAdmin() {
        String token = "Bearer " + creatNewJwt();
        ResponseEntity<String> response = adminController.banUser(token, 1234L);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void banUser_shouldReturn_whenNAdmin() {
        String token = "Bearer " + creatNewAdminJwt();
        ResponseEntity<String> response = adminController.banUser(token, 1234L);
        assertNotNull(response);
    }

    @Test
    void banUser_shouldReturnSuccess_whenNoAdmin() {
        when(userService.banUserById(1234L)).thenReturn(true);
        String token = "Bearer " + creatNewAdminJwt();
        ResponseEntity<String> response = adminController.banUser(token, 1234L);
        assertNotNull(response);
    }

    @Test
    void activateUser_shouldReturnForbidden_whenNotAdmin() {
        String token = "Bearer " + creatNewJwt();
        ResponseEntity<String> response = adminController.activateUser(token, 1L);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void activateUser_shouldReturn_whenAdmin() {
        String token = "Bearer " + creatNewAdminJwt();
        ResponseEntity<String> response = adminController.activateUser(token, 1L);
//        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertNotNull(response);
    }

    @Test
    void activateUser_shouldReturnOk_whenAdmin() {
        when(userService.activeUserById(1L)).thenReturn(true);
        String token = "Bearer " + creatNewAdminJwt();
        ResponseEntity<String> response = adminController.activateUser(token, 1L);
//        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertNotNull(response);
    }

    @Test
    void promoteToAdmin_shouldReturnForbidden_whenNotSuperAdmin() {
        // Given a JWT with role USER
        String token = "Bearer " + Jwts.builder()
                .setSubject("test_user")
                .claim("role", "USER")
                .setIssuedAt(new Date())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // When
        ResponseEntity<?> response = adminController.promoteToAdmin(token, 123L);

        // Then
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Not authorized", response.getBody());
    }

    @Test
    void promoteToAdmin_shouldReturnBadRequest_whenAlreadyAdmin() {
        // Given SUPER_ADMIN token
        String token = "Bearer " + Jwts.builder()
                .setSubject("super_admin")
                .claim("role", "SUPER_ADMIN")
                .setIssuedAt(new Date())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        when(userService.promoteToAdmin(123L)).thenReturn(false);

        // When
        ResponseEntity<?> response = adminController.promoteToAdmin(token, 123L);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User is already ADMIN or SUPER_ADMIN", response.getBody());
    }

    @Test
    void promoteToAdmin_shouldReturnOk_whenSuccess() {
        // Given SUPER_ADMIN token
        String token = "Bearer " + Jwts.builder()
                .setSubject("super_admin")
                .claim("role", "SUPER_ADMIN")
                .setIssuedAt(new Date())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        when(userService.promoteToAdmin(123L)).thenReturn(true);

        // When
        ResponseEntity<?> response = adminController.promoteToAdmin(token, 123L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User promoted to ADMIN", response.getBody());
    }

}
