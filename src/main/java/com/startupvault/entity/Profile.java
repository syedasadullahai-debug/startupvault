package com.startupvault.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 1000)
    private String bio;

    @ElementCollection
    @CollectionTable(name = "profile_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    private String github;
    private String linkedin;
    private String college;
    private String avatarUrl;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
