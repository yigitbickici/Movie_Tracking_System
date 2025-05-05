package com.Movie_Management_System.spring.services;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.UUID;

@Service
public class AzureBlobService {

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    private BlobServiceClient blobServiceClient;
    private BlobContainerClient containerClient;

    @PostConstruct
    public void initialize() {
        blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
        containerClient = blobServiceClient.getBlobContainerClient(containerName);
    }

    public String uploadFile(MultipartFile file, String prefix) throws IOException {
        // Generate a unique name for the blob
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String blobName = prefix + "/" + UUID.randomUUID().toString() + extension;

        // Get a reference to a blob
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Upload the file
        blobClient.upload(file.getInputStream(), file.getSize(), true);

        // Return the URL of the blob
        return blobClient.getBlobUrl();
    }

    public void deleteFile(String blobUrl) {
        // Extract blob name from URL
        String blobName = blobUrl.substring(blobUrl.indexOf(containerName) + containerName.length() + 1);
        
        // Get a reference to the blob
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        
        // Delete the blob if it exists
        if (blobClient.exists()) {
            blobClient.delete();
        }
    }
} 