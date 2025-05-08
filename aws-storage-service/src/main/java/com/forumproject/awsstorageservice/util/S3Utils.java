package com.forumproject.awsstorageservice.util;

import java.net.URI;
import java.net.URISyntaxException;

public class S3Utils {

    public static String extractKeyFromUrl(String url) {
        //the format of url is:
        // https://happypathbucket123.s3.us-east-2.
        // amazonaws.com/fa4475be-aedd-4905-a3d5-b3a643b40753_
        // default-avatar-icon-of-social-media-user-vector.jpg
        try {
            URI uri = new URI(url);
            return uri.getPath().startsWith("/") ?
                    uri.getPath().substring(1) : uri.getPath();
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("Invalid S3 URL format: " + url, e);
        }
    }
}

