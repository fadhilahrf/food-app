package com.application.foodapp.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;

@Service
public class FirebaseService {

    private final Logger log = LoggerFactory.getLogger(FirebaseService.class);

    private Storage storage;

    @Value("${firebase.storage.bucket-name}")
    private String bucketName;

    @Value("${firebase.credential-file-path}")
    private String credentialFilePath;

    @Value("${firebase.storage.media-path}")
    private String mediaPath;

    public FirebaseService(Storage storage) {
        this.storage = storage;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        log.debug("uploadImage firebase");

        String filename = System.currentTimeMillis() + "_" + UUID.randomUUID().toString();

        BlobId blobId = BlobId.of(bucketName, filename);

        InputStream inputStream = file.getInputStream();

        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
        storage.create(blobInfo, inputStream.readAllBytes());

        return filename;
    }

    public void deleteImage(String filename) throws Exception {
        BlobId blobId = BlobId.of(bucketName, filename);
        storage.delete(blobId);
    }

}
