package com.forumproject.awsstorageservice.controller;

import com.forumproject.awsstorageservice.dto.UploadResponse;
import com.forumproject.awsstorageservice.service.S3Service;
import com.forumproject.awsstorageservice.util.S3Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/s3")
@RequiredArgsConstructor
public class FileUploadController {
    @Autowired
    private S3Service s3Service;

    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file,
                                 @RequestParam("password") String password) {
        if(!"password123".equals(password)){
            return  "No auth";
        }
        try {
            String url = s3Service.uploadFile(file);
            return  url;
        } catch (Exception e) {
            // fault tolerance design in the future
            System.out.println(e.getMessage());
            return "https://happypathbucket123.s3.amazonaws.com/" +
                    "fa4475be-aedd-4905-a3d5-b3a643b40753_default-avatar-icon-of-social-media-user-vector.jpg";
        }
    }

    @PostMapping("/delete")
    public boolean delete(@RequestParam("url") String fileUrl,
                          @RequestParam("password") String password) {
        if(!"password123".equals(password)){
            return  false;
        }
        try {
            String key = S3Utils.extractKeyFromUrl(fileUrl);
            return s3Service.deleteFile(key);
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/default_avatar")
    public String getDefaultAvatar(){
        return "https://happypathbucket123.s3.amazonaws.com/fa4475be-aedd-4905-a3d5-b3a643b40753_default-avatar-icon-of-social-media-user-vector.jpg";
    }

}

