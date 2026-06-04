package com.startupvault.repository;

import com.startupvault.entity.Startup;
import com.startupvault.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StartupRepository extends JpaRepository<Startup, Long> {

    List<Startup> findByFounder(User founder);

    @Query("""
        SELECT s FROM Startup s
        WHERE (:search IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(s.problem) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:category IS NULL OR s.category = :category)
    """)
    Page<Startup> searchStartups(
        @Param("search") String search,
        @Param("category") String category,
        Pageable pageable
    );

    @Query("""
        SELECT s FROM Startup s
        JOIN StartupMember sm ON sm.startup = s
        WHERE sm.user = :user
    """)
    List<Startup> findJoinedStartups(@Param("user") User user);
}
