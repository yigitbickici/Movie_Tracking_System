package com.Movie_Management_System.spring.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "spoiler_requests")
public class SpoilerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties({"comments", "spoilerRequests", "likes"})
    private Posts post;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "comment_id")
    @JsonIgnoreProperties("post")
    private Comment comment;

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime resolvedAt;

    @Column(length = 500)
    private String resolvedReason;

    @Column(nullable = false)
    private Boolean isAutomatic = false;

    @Column(nullable = false)
    private Boolean isUrgent = false;

    @ManyToOne
    @JoinColumn(name = "resolved_by_user_id")
    private User resolvedByUser;

    @ManyToOne
    @JoinColumn(name = "requested_by_user_id", nullable = false)
    @JsonIgnoreProperties({"password", "email", "posts", "comments", "watchlist", "watchedMovies", "favoriteMovies", "followers", "following", "requestedSpoilers", "resolvedSpoilers"})
    private User requestedByUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SpoilerRequestType type;

    @Column(nullable = false)
    private Integer reportCount = 1;

    @Column
    private LocalDateTime lastReportedAt;

    @Column(nullable = false)
    private Boolean notificationSent = false;

    @Column(nullable = false)
    private Boolean resolvedNotificationSent = false;

    @Column(nullable = false)
    private Integer priority = 0;

    @ManyToOne
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedTo;

    @Column
    private LocalDateTime assignedAt;

    @ManyToOne
    @JoinColumn(name = "assigned_by_user_id")
    private User assignedBy;

    @Column(length = 1000)
    private String notes;

    @Column(length = 255)
    private String tags;

    @Column(length = 50)
    private String category;

    @Column(length = 50)
    private String source;

    @Column(length = 45)
    private String ipAddress;

    @Column(length = 255)
    private String userAgent;

    @Column(length = 255)
    private String referrer;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Version
    private Long version;

    @Column(nullable = false)
    private Boolean deleted = false;

    @Column
    private LocalDateTime deletedAt;

    @ManyToOne
    @JoinColumn(name = "deleted_by_user_id")
    private User deletedBy;

    @Column(length = 255)
    private String deletedReferrer;

    @Column(length = 50)
    private String deletedSource;

    @Column(length = 50)
    private String deletedCategory;

    @Column(length = 255)
    private String deletedTags;

    @Column(length = 1000)
    private String deletedNotes;

    @Column(columnDefinition = "TEXT")
    private String deletedMetadata;

    @Column
    private LocalDateTime deletedAssignedAt;

    @ManyToOne
    @JoinColumn(name = "deleted_assigned_by_user_id")
    private User deletedAssignedBy;

    // Constructors
    public SpoilerRequest() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Posts getPost() {
        return post;
    }

    public void setPost(Posts post) {
        this.post = post;
    }

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolvedReason() {
        return resolvedReason;
    }

    public void setResolvedReason(String resolvedReason) {
        this.resolvedReason = resolvedReason;
    }

    public User getResolvedByUser() {
        return resolvedByUser;
    }

    public void setResolvedByUser(User resolvedByUser) {
        this.resolvedByUser = resolvedByUser;
    }

    public User getRequestedByUser() {
        return requestedByUser;
    }

    public void setRequestedByUser(User requestedByUser) {
        this.requestedByUser = requestedByUser;
    }

    public SpoilerRequestType getType() {
        return type;
    }

    public void setType(SpoilerRequestType type) {
        this.type = type;
    }

    public Boolean getIsAutomatic() {
        return isAutomatic;
    }

    public void setIsAutomatic(Boolean isAutomatic) {
        this.isAutomatic = isAutomatic;
    }

    public Boolean getIsUrgent() {
        return isUrgent;
    }

    public void setIsUrgent(Boolean isUrgent) {
        this.isUrgent = isUrgent;
    }

    public Integer getReportCount() {
        return reportCount;
    }

    public void setReportCount(Integer reportCount) {
        this.reportCount = reportCount;
    }

    public LocalDateTime getLastReportedAt() {
        return lastReportedAt;
    }

    public void setLastReportedAt(LocalDateTime lastReportedAt) {
        this.lastReportedAt = lastReportedAt;
    }

    public Boolean getNotificationSent() {
        return notificationSent;
    }

    public void setNotificationSent(Boolean notificationSent) {
        this.notificationSent = notificationSent;
    }

    public Boolean getResolvedNotificationSent() {
        return resolvedNotificationSent;
    }

    public void setResolvedNotificationSent(Boolean resolvedNotificationSent) {
        this.resolvedNotificationSent = resolvedNotificationSent;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public User getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(User assignedBy) {
        this.assignedBy = assignedBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getReferrer() {
        return referrer;
    }

    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public User getDeletedBy() {
        return deletedBy;
    }

    public void setDeletedBy(User deletedBy) {
        this.deletedBy = deletedBy;
    }

    public String getDeletedReferrer() {
        return deletedReferrer;
    }

    public void setDeletedReferrer(String deletedReferrer) {
        this.deletedReferrer = deletedReferrer;
    }

    public String getDeletedSource() {
        return deletedSource;
    }

    public void setDeletedSource(String deletedSource) {
        this.deletedSource = deletedSource;
    }

    public String getDeletedCategory() {
        return deletedCategory;
    }

    public void setDeletedCategory(String deletedCategory) {
        this.deletedCategory = deletedCategory;
    }

    public String getDeletedTags() {
        return deletedTags;
    }

    public void setDeletedTags(String deletedTags) {
        this.deletedTags = deletedTags;
    }

    public String getDeletedNotes() {
        return deletedNotes;
    }

    public void setDeletedNotes(String deletedNotes) {
        this.deletedNotes = deletedNotes;
    }

    public String getDeletedMetadata() {
        return deletedMetadata;
    }

    public void setDeletedMetadata(String deletedMetadata) {
        this.deletedMetadata = deletedMetadata;
    }

    public LocalDateTime getDeletedAssignedAt() {
        return deletedAssignedAt;
    }

    public void setDeletedAssignedAt(LocalDateTime deletedAssignedAt) {
        this.deletedAssignedAt = deletedAssignedAt;
    }

    public User getDeletedAssignedBy() {
        return deletedAssignedBy;
    }

    public void setDeletedAssignedBy(User deletedAssignedBy) {
        this.deletedAssignedBy = deletedAssignedBy;
    }

    // Pre-persist hook to set createdAt
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Pre-update hook to set updatedAt
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 