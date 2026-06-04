package com.startupvault.repository;

import com.startupvault.entity.Like;
import com.startupvault.entity.Startup;
import com.startupvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByStartupAndUser(Startup startup, User user);
    Optional<Like> findByStartupAndUser(Startup startup, User user);
    long countByStartup(Startup startup);
}
