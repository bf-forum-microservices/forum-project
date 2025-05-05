package com.forum.authService.feign;

import com.forum.authService.dto.LoginRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.forum.authService.dto.*;

@FeignClient(name = "user-service")
public interface UserClient {

    @PostMapping("/users/validate")
    UserDTO validateUser(@RequestBody LoginRequestDTO loginRequestDTO);
}
