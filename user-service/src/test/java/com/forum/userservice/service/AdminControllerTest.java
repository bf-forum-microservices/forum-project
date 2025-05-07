package com.forum.userservice.service;

import com.forum.userservice.controller.AdminController;
import com.forum.userservice.dto.UserDTO;
import com.forum.userservice.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    private static final String TEST_JWT = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3MDAwMDAwMDAsImlhdCI6MTcwMDAwMDAwMH0.d8xY4A_K9i8Nd2-vg3NYvZixTnpZUXmVKn7mCP9u2J8";

    @InjectMocks
    private AdminController adminController;

    @Mock
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        adminController = spy(new AdminController(userService));
//        doReturn("mysecret").when(adminController).getJwtSecret(); // if you expose getter
        adminController.overrideJwtSecretForTest(TEST_JWT);
    }

    private String buildTokenWithRole(String role) {
        Claims claims = mock(Claims.class);
        when(claims.get("role", String.class)).thenReturn(role);
        Jwts.parser().setSigningKey("mysecret".getBytes()); // required for real parsing, skipped here
        return "Bearer faketoken"; // Replace with real parsing logic in integration test
    }

    @Test
    void getAllUserInfo_shouldReturnForbidden_whenRoleIsNotAdmin() {
//        String token = "Bearer faketoken";
        // Stub token parsing manually
        ResponseEntity<List<UserDTO>> response = adminController.getAllUserInfo("Bearer faketoken");
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void banUser_shouldReturnForbidden_whenNotAdmin() {
        String token = TEST_JWT;
        ResponseEntity<String> response = adminController.banUser(token, 1L);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void activateUser_shouldReturnForbidden_whenNotAdmin() {
        String token = "Bearer faketoken";
        ResponseEntity<String> response = adminController.activateUser(token, 1L);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    // These three below require real JWT mock or changing controller code to extract Claims via separate method
    // Or refactor: extract claim logic into a helper class that is unit testable with mocked return value.

}
