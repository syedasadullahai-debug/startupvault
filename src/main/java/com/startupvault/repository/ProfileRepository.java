package com.startupvault.repository;

import com.startupvault.entity.Profile;
import com.startupvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUser(User user);
    Optional<Profile> findByUserId(Long userId);
}
