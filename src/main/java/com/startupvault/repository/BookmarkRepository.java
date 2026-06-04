package com.startupvault.repository;

import com.startupvault.entity.Bookmark;
import com.startupvault.entity.Startup;
import com.startupvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    boolean existsByStartupAndUser(Startup startup, User user);
    Optional<Bookmark> findByStartupAndUser(Startup startup, User user);
}
