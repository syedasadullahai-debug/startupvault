package com.startupvault.repository;

import com.startupvault.entity.Startup;
import com.startupvault.entity.StartupMember;
import com.startupvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StartupMemberRepository extends JpaRepository<StartupMember, Long> {
    boolean existsByStartupAndUser(Startup startup, User user);
    List<StartupMember> findByStartup(Startup startup);
    long countByUser(User user);
    List<StartupMember> findByUser(User user);
}
