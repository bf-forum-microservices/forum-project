package com.forum.userservice.service;

import com.forum.userservice.Enum.UserRole;
import com.forum.userservice.dto.*;
import com.forum.userservice.entity.User;
import com.forum.userservice.exception.ForbiddenException;
import com.forum.userservice.repository.EmailPublisher;
import com.forum.userservice.repository.UserAuthRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserAuthRepository userAuthRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailPublisher emailPublisher;

    private User user;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(userService, "emailPublisher", emailPublisher);

        user = new User();
        user.setUserId(1L);
        user.setEmail("user@example.com");
        user.setPassword("encoded-password");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setType(UserRole.USER);
        user.setVerificationCode("123456");
        user.setBanned(false);
        user.setActive(false);
    }

    /**
     * Login returns correct result
     * */
    @Test
    void validateUser_shouldReturnUserAuthDTO_whenValidCredentials() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("user@example.com");
        request.setPassword("password");

        when(userAuthRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encoded-password")).thenReturn(true);

        ResponseEntity<UserAuthDTO> response = userService.validateUser(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("user@example.com", response.getBody().getEmail());
    }

    /**
     * Login fails due to incorrect password
     */
    @Test
    void validateUser_shouldThrow_whenPasswordDoesNotMatch() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("user@example.com");
        request.setPassword("wrong-password");

        when(userAuthRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            userService.validateUser(request);
        });

        assertEquals("Invalid password.", ex.getMessage());
    }

    /**
     * Login fails because user does not exist
     */
    @Test
    void validateUser_shouldReturn404_whenUserNotFound() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("notfound@example.com");
        request.setPassword("password");

        when(userAuthRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        ResponseEntity<UserAuthDTO> response = userService.validateUser(request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    /**
     * Registers a new user and sends verification email
     */
    @Test
    void registerUser_shouldSaveUserAndSendEmail() {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setEmail("new@example.com");
        request.setPassword("plain-password");
        request.setFirstName("New");
        request.setLastName("User");

        when(userAuthRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("plain-password")).thenReturn("encoded-password");

        userService.registerUser(request);

        verify(userAuthRepository, times(1)).save(any(User.class));
        verify(emailPublisher, times(1)).sendVerificationEmail(eq("new@example.com"), anyString());
    }

    /**
     * Login wrong passwords
     */
    @Test
    void validateUser_shouldThrow_whenPasswordIncorrect() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("user@example.com");
        request.setPassword("wrong");

        when(userAuthRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded-password")).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            userService.validateUser(request);
        });

        assertEquals("Invalid password.", ex.getMessage()); // Or your actual error
    }

    @Test
    void validateUser_shouldThrowForbidden_whenUserIsBanned() {
        user.setBanned(true);
        LoginRequestDTO request = new LoginRequestDTO("user@example.com", "password");
        when(userAuthRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));

        assertThrows(ForbiddenException.class, () -> userService.validateUser(request));
    }

    @Test
    void validateUser_shouldThrow_whenPasswordIsIncorrect() {
        LoginRequestDTO request = new LoginRequestDTO("user@example.com", "wrong");
        when(userAuthRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPassword())).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.validateUser(request));
    }


    @Test
    void verifyEmail_shouldActivateUser_whenCodeMatches() {
        when(userAuthRepository.findByEmailAndVerificationCode("user@example.com", "123456"))
                .thenReturn(Optional.of(user));

        boolean result = userService.verifyEmail("user@example.com", "123456");
        assertTrue(result);
        assertTrue(user.isActive());
    }

    @Test
    void verifyEmail_shouldReturnFalse_whenCodeInvalid() {
        when(userAuthRepository.findByEmailAndVerificationCode(any(), any())).thenReturn(Optional.empty());
        assertFalse(userService.verifyEmail("a@b.com", "wrong"));
    }

    @Test
    void updateProfile_shouldUpdateUserFields() {
        UpdateProfileRequestDTO dto = new UpdateProfileRequestDTO("user@example.com", "New", "Name", "pass", "url");
        when(userAuthRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("pass")).thenReturn("hashed");

        userService.updateProfile(dto);
        assertEquals("New", user.getFirstName());
        assertEquals("Name", user.getLastName());
        assertEquals("hashed", user.getPassword());
        assertEquals("url", user.getProfileImageURL());
    }

    @Test
    void confirmEmailUpdate_shouldUpdateEmail_whenCodeMatches() {
        user.setPendingEmail("new@example.com");
        user.setVerificationCode("123456");
        when(userAuthRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        userService.confirmEmailUpdate("user@example.com", "123456");
        assertEquals("new@example.com", user.getEmail());
        assertNull(user.getPendingEmail());
        assertNull(user.getVerificationCode());
    }

    @Test
    void confirmEmailUpdate_shouldThrow_whenCodeIncorrect() {
        user.setVerificationCode("123456");
        when(userAuthRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () -> userService.confirmEmailUpdate("user@example.com", "wrong"));
    }

    @Test
    void getUserInfoByEmail_shouldReturnDTO_whenUserExists() {
        when(userAuthRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        UserDTO dto = userService.getUserInfoByEmail("user@example.com");
        assertEquals("user@example.com", dto.getEmail());
    }

    @Test
    void getUserInfoByEmail_shouldThrow_whenUserNotFound() {
        when(userAuthRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userService.getUserInfoByEmail("missing@example.com"));
    }

    @Test
    void getAllUserInfo_shouldReturnMappedUserDTOs() {
        User secondUser = new User();
        secondUser.setUserId(2L);
        secondUser.setEmail("second@example.com");

        when(userAuthRepository.findAll()).thenReturn(Arrays.asList(user, secondUser));

        List<UserDTO> result = userService.getAllUserInfo();
        assertEquals(2, result.size());
    }

    @Test
    void banUserById_shouldBanUser_whenUserIsNotBanned() {
        user.setBanned(false);
        when(userAuthRepository.findById(1L)).thenReturn(Optional.of(user));
        assertTrue(userService.banUserById(1L));
        assertTrue(user.isBanned());
    }

    @Test
    void banUserById_shouldReturnFalse_whenUserNotFound() {
        when(userAuthRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertFalse(userService.banUserById(999L));
    }

    @Test
    void activeUserById_shouldUnbanUser_whenUserIsBanned() {
        user.setBanned(true);
        when(userAuthRepository.findById(1L)).thenReturn(Optional.of(user));
        assertTrue(userService.activeUserById(1L));
        assertFalse(user.isBanned());
    }

    @Test
    void activeUserById_shouldReturnFalse_whenUserAlreadyActive() {
        user.setBanned(false);
        when(userAuthRepository.findById(1L)).thenReturn(Optional.of(user));
        assertFalse(userService.activeUserById(1L));
    }

    @Test
    void registerUser_shouldThrowException_whenEmailExists() {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setEmail("user@example.com");

        when(userAuthRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.registerUser(request));
        assertEquals("Email already registered", ex.getMessage());
    }

//    @Test
//    void requestEmailUpdate_shouldUpdateFieldsAndSave() {
//        when(userAuthRepository.findByEmail("old@example.com")).thenReturn(Optional.of(user));
//
//        userService.requestEmailUpdate("old@example.com", "new@example.com");
//
//        assertEquals("new@example.com", user.getPendingEmail());
//        verify(userAuthRepository).save(user);
//    }

    @Test
    void processContactMessage_shouldPrintDetails() {
        assertDoesNotThrow(() -> userService.processContactMessage("email@example.com", "Subject", "Message"));
    }

    @Test
    void banUserById_shouldReturnFalse_ifUserNotFound() {
        when(userAuthRepository.findById(1L)).thenReturn(Optional.empty());
        assertFalse(userService.banUserById(1L));
    }

    @Test
    void banUserById_shouldReturnFalse_ifUserAlreadyBanned() {
        user.setBanned(true);
        when(userAuthRepository.findById(1L)).thenReturn(Optional.of(user));
        assertFalse(userService.banUserById(1L));
    }

    @Test
    void banUserById_shouldBanUser_ifNotBanned() {
        user.setBanned(false);
        when(userAuthRepository.findById(1L)).thenReturn(Optional.of(user));
        assertTrue(userService.banUserById(1L));
        verify(userAuthRepository).save(user);
        assertTrue(user.isBanned());
    }

    @Test
    void activeUserById_shouldReturnFalse_ifUserNotFound() {
        when(userAuthRepository.findById(1L)).thenReturn(Optional.empty());
        assertFalse(userService.activeUserById(1L));
    }

    @Test
    void activeUserById_shouldReturnFalse_ifUserAlreadyActive() {
        user.setBanned(false);
        when(userAuthRepository.findById(1L)).thenReturn(Optional.of(user));
        assertFalse(userService.activeUserById(1L));
    }

    @Test
    void activeUserById_shouldActivateUser_ifBanned() {
        user.setBanned(true);
        when(userAuthRepository.findById(1L)).thenReturn(Optional.of(user));
        assertTrue(userService.activeUserById(1L));
        verify(userAuthRepository).save(user);
        assertFalse(user.isBanned());
    }

    @Test
    void getAllUserInfo_shouldReturnListOfDTOs() {
        when(userAuthRepository.findAll()).thenReturn(Arrays.asList(user));
        List<UserDTO> users = userService.getAllUserInfo();
        assertEquals(1, users.size());
        assertEquals("user@example.com", users.get(0).getEmail());
    }

    @Test
    void updateProfile_shouldThrow_whenUserNotFound() {
        UpdateProfileRequestDTO dto = new UpdateProfileRequestDTO("missing@example.com", "New", "Name", "pass", "url");
        when(userAuthRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userService.updateProfile(dto));
    }

}


