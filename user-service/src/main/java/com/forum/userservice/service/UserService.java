package com.forum.userservice.service;

import com.forum.userservice.Enum.UserRole;
import com.forum.userservice.dto.LoginRequestDTO;
import com.forum.userservice.dto.RegisterRequestDTO;
import com.forum.userservice.dto.RegisterReturnDTO;
import com.forum.userservice.dto.UserDTO;
import com.forum.userservice.entity.User;
import com.forum.userservice.repository.UserAuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserAuthRepository userAuthRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private EmailPublisher emailPublisher;

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
//        if (newUser.getProfileImageURL() == null || newUser.getProfileImageURL().isEmpty()) {
//            newUser.setProfileImageURL("https://your-default-image-url.com/default.jpg");
//        }

        // TODO: Publish email verification message to RabbitMQ
        if (emailPublisher != null) {
            System.out.println("EmailPublisher not available — skipping email verification step.");
        } else {
            emailPublisher.sendVerificationEmail(newUser.getEmail(), "dummy-token");
        }

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

    public ResponseEntity<UserDTO> validateUser(LoginRequestDTO request) {
        Optional<User> userOpt = userAuthRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(user.getUserId());
        userDTO.setEmail(user.getEmail());
        userDTO.setType(user.getType());

        return ResponseEntity.ok(userDTO);
    }
}
