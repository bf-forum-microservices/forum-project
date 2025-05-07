package com.forum.userservice.service;

import com.forum.userservice.controller.UserAuthController;
import com.forum.userservice.dto.*;
import com.forum.userservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserAuthControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserAuthController userAuthController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerUser_shouldReturn201_withDTO() {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setEmail("user@example.com");
        request.setPassword("password");
        request.setFirstName("First");
        request.setLastName("Last");

        RegisterReturnDTO expected = new RegisterReturnDTO("First", "Last", "user@example.com");

        when(userService.registerUser(request)).thenReturn(expected);

        ResponseEntity<?> response = userAuthController.registerUser(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expected, response.getBody());
    }

    @Test
    void verifyEmail_shouldReturn200_whenSuccess() {
        VerifyCodeDTO request = new VerifyCodeDTO();
        request.setEmail("user@example.com");
        request.setCode("123456");

        when(userService.verifyEmail("user@example.com", "123456")).thenReturn(true);

        ResponseEntity<?> response = userAuthController.verifyEmail(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Email verified successfully.", response.getBody());
    }

    @Test
    void verifyEmail_shouldReturn400_whenInvalidCode() {
        VerifyCodeDTO request = new VerifyCodeDTO();
        request.setEmail("user@example.com");
        request.setCode("wrong");

        when(userService.verifyEmail("user@example.com", "wrong")).thenReturn(false);

        ResponseEntity<?> response = userAuthController.verifyEmail(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid or expired verification code.", response.getBody());
    }

    @Test
    void validateUser_shouldReturnUserAuthDTO_whenValid() {
        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("password");

        UserAuthDTO expected = new UserAuthDTO();
        expected.setEmail("user@example.com");
        expected.setUserId(1L);

        when(userService.validateUser(loginRequest)).thenReturn(ResponseEntity.ok(expected));

        ResponseEntity<UserAuthDTO> response = userAuthController.validateUser(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("user@example.com", response.getBody().getEmail());
    }
}
