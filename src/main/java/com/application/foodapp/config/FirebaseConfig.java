package com.application.foodapp.config;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.credential-file-path}")
    private String credentialFilePath;

    @Value("${firebase.storage.bucket-name}")
    private String bucketName;

    @Bean
    public Storage googleCloudStorage() throws Exception {
        Credentials credentials = GoogleCredentials.fromStream(new ClassPathResource(credentialFilePath).getInputStream());
        return StorageOptions.newBuilder().setCredentials(credentials).build().getService();
    }
}
