package com.forum.userservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "aws-storage-service")
public interface AwsStorageFeignClient {

    @GetMapping("/s3/default_avatar")
    String getDefaultAvatar();

    @PostMapping(value = "/s3/upload", consumes = "multipart/form-data")
    String upload(@RequestPart("file") MultipartFile file,
                  @RequestPart("password") String password);
}
