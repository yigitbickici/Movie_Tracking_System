package com.Movie_Management_System.spring.dto;

public class UserAdminDTO {
    private Long id;
    private String username;
    private String email;
    private boolean isBanned;
    private String banReason;
    private String role; 

    public UserAdminDTO(Long id, String username, String email, boolean isBanned, String banReason, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.isBanned = isBanned;
        this.banReason = banReason;
        this.role = role;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isBanned() { return isBanned; }
    public void setBanned(boolean banned) { isBanned = banned; }

    public String getBanReason() { return banReason; }
    public void setBanReason(String banReason) { this.banReason = banReason; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
