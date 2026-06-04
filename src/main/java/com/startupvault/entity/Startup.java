package com.startupvault.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "startups")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Startup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String problem;

    @Column(nullable = false, length = 2000)
    private String solution;

    @Column(nullable = false)
    private String category;

    @ElementCollection
    @CollectionTable(name = "startup_skills", joinColumns = @JoinColumn(name = "startup_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> requiredSkills = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "founder_id", nullable = false)
    private User founder;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
