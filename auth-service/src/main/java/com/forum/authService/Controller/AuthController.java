package com.forum.authService.Controller;

import com.forum.authService.dto.AuthResponseDTO;
import com.forum.authService.dto.LoginRequestDTO;
import com.forum.authService.dto.UserDTO;
import com.forum.authService.feign.UserClient;
import com.forum.authService.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserClient userClient;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        // user service returns validated user.
        UserDTO user = userClient.validateUser(loginRequestDTO);

        String token = jwtUtil.generateToken(user.getUserId(), user.getEmail(), user.getType().name());
        return ResponseEntity.ok(new AuthResponseDTO(user.getUserId(), user.getEmail(), user.getType().name(), token));
    }



}



