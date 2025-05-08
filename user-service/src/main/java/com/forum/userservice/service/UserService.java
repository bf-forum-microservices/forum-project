package com.forum.userservice.service;

import com.forum.userservice.Enum.UserRole;
import com.forum.userservice.RabbitMessagePublisher;
import com.forum.userservice.dto.*;
import com.forum.userservice.entity.User;
import com.forum.userservice.exception.ForbiddenException;
import com.forum.userservice.feign.AwsStorageFeignClient;
import com.forum.userservice.repository.EmailPublisher;
import com.forum.userservice.repository.UserAuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserAuthRepository userAuthRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private AwsStorageFeignClient awsStorageFeignClient;

    @Autowired(required = false)
    private EmailPublisher emailPublisher;

    @Autowired
    private RabbitMessagePublisher rabbitMessagePublisher;

//    public User createNewUser() {
//        User newUser = new User();
//        return newUser
//    }

    @Transactional
    public RegisterReturnDTO registerUser(RegisterRequestDTO registerRequest) {
        Optional<User> existingUser = userAuthRepository.findByEmail(registerRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User newUser = new User();
        newUser.setFirstName(registerRequest.getFirstName());
        newUser.setLastName(registerRequest.getLastName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setActive(false);
        newUser.setType(UserRole.USER);
        newUser.setVerificationCode(generate6DigitCode());
            // TODO: upload photos
        String avatarUrl = awsStorageFeignClient.getDefaultAvatar();
        newUser.setProfileImageURL(avatarUrl);

        emailPublisher.sendVerificationEmail(newUser.getEmail(), newUser.getVerificationCode());

        userAuthRepository.save(newUser);

        return new RegisterReturnDTO(newUser.getFirstName(), newUser.getLastName(), newUser.getEmail());
    }

    private String generate6DigitCode() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }

    @Transactional
    public boolean verifyEmail(String email, String code) {
        Optional<User> optionalUser = userAuthRepository.findByEmailAndVerificationCode(email, code);

        if (optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();
        user.setActive(true);
        user.setVerificationCode(null); // Clear the code
        userAuthRepository.save(user); //

        return true;
    }

    public ResponseEntity<UserAuthDTO> validateUser(LoginRequestDTO request) {
        Optional<User> userOpt = userAuthRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        if (userOpt.get().isBanned()) {
            throw new ForbiddenException("Your account has been banned.");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password.");
        }

        UserAuthDTO userAuthDTO = new UserAuthDTO();
        userAuthDTO.setUserId(user.getUserId());
        userAuthDTO.setEmail(user.getEmail());
        userAuthDTO.setType(user.getType());

        return ResponseEntity.ok(userAuthDTO);
    }

    public void updateProfile(UpdateProfileRequestDTO dto) {
        User user = userAuthRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setProfileImageURL(dto.getProfileImageURL());

        userAuthRepository.save(user);
    }

    @Transactional
    public void requestEmailUpdate(String currentEmail, String newEmail) {
        User user = userAuthRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPendingEmail(newEmail);
        user.setVerificationCode(generate6DigitCode());


        System.out.println("update email, About to send email");

        emailPublisher.sendVerificationEmail(user.getPendingEmail(), user.getVerificationCode());

        System.out.println("Send email to new email");

        userAuthRepository.save(user);
    }

    @Transactional
    public void confirmEmailUpdate(String currentEmail, String code) {
        User user = userAuthRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!code.equals(user.getVerificationCode())) {
            throw new RuntimeException("Invalid verification code");
        }

        user.setEmail(user.getPendingEmail());
        user.setPendingEmail(null);
        user.setVerificationCode(null);
        userAuthRepository.save(user);
    }

    public UserDTO getUserInfoByEmail(String email) {
        Optional<User> optionalUser = userAuthRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        User user = optionalUser.get();

        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setType(user.getType());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setProfileImageURL(user.getProfileImageURL());
        dto.setActive(user.isActive());
        dto.setBanned(user.isBanned());

        return dto;
    }
    public UserDTO getUserInfoById(Long userId) {
        Optional<User> optionalUser = userAuthRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        User user = optionalUser.get();

        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setType(user.getType());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setProfileImageURL(user.getProfileImageURL());
        dto.setActive(user.isActive());
        dto.setBanned(user.isBanned());

        return dto;
    }


    public void processContactMessage(String email, String subject, String message) {
        // Log it or send email (or save to DB)
        System.out.println("Contact Us message from " + email);
        System.out.println("Subject: " + subject);
        System.out.println("Message: " + message);

        // TODO: use emailPublisher.sendContactEmail(email, subject, message); if RabbitMQ setup
    }

    public List<UserDTO> getAllUserInfo() {
        List<User> users = userAuthRepository.findAll();

        return users.stream().map(user -> {
            UserDTO dto = new UserDTO();
            dto.setUserId(user.getUserId());
            dto.setEmail(user.getEmail());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setType(user.getType());
            dto.setProfileImageURL(user.getProfileImageURL());
            dto.setActive(user.isActive());
            dto.setBanned(user.isBanned());
            return dto;
        }).collect(Collectors.toList());
    }
    public boolean banUserById(Long userId) {
        Optional<User> userOpt = userAuthRepository.findById(userId);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        if (user.isBanned()) return false; // already banned

        user.setBanned(true);
        userAuthRepository.save(user);
        return true;
    }

    public boolean activeUserById(Long userId) {
        Optional<User> userOpt = userAuthRepository.findById(userId);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        if (!user.isBanned()) return false; // already not banned

        user.setBanned(false);
        userAuthRepository.save(user);
        return true;
    }

}
