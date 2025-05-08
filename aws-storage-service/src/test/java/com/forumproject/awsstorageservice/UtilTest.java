package com.forumproject.awsstorageservice;

import com.forumproject.awsstorageservice.util.S3Utils;
import org.junit.jupiter.api.Test;

public class UtilTest {

    public static String url = "https://happypathbucket123." +
            "s3.us-east-2.amazonaws.com/fa4475be-aedd-49" +
            "05-a3d5-b3a643b40753_default-avatar-icon-of-social-media-user-vector.jpg";
    @Test
    public static void main(String[] args) {
        System.out.println(S3Utils.extractKeyFromUrl(url));
    }
}
