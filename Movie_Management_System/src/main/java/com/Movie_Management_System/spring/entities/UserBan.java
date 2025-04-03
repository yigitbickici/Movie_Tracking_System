package com.Movie_Management_System.spring.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "user_bans")
public class UserBan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;

    private String reason;

    private boolean active = true;

    public UserBan() {}

    public UserBan(User user, String reason) {
        this.user = user;
        this.reason = reason;
        this.active = true;
    }

    // Getter & Setter
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
