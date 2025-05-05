package com.forum.userservice.controller;

import com.forum.userservice.dto.UserIdRequestDTO;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    @PutMapping("/updateProfile")
    public String updateProfile(@RequestBody @Valid UserIdRequestDTO request) {
        return "users/updateProfile";
    }

    @PutMapping("/updateEmail")
    public String updateEmail(@RequestBody @Valid UserIdRequestDTO request) {
        return "users/updateEmail";
    }

    @PostMapping("/verifyUpdateEmailCode")
    public String verifyUpdateEmailCode(@RequestBody @Valid UserIdRequestDTO request) {
        return "users/verifyUpdateEmailCode";
    }

    @GetMapping("/info")
    public String getUserInfo(@RequestParam String userId) {
        return "users/info";
    }

    @PostMapping("/contactUs")
    public String contactUs(@RequestBody @Valid UserIdRequestDTO request) {
        return "users/contactUs";
    }


//    private UserService userService;
//
//    @PostMapping("/register")
//    public ResponseEntity<?> registerUser(@RequestBody RegisterRequestDTO registerRequest){
//        RegisterReturnDTO result = userService.registerUser(registerRequest);
//        return ResponseEntity.status(HttpStatus.CREATED).body(result);
//    }
}
