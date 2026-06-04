package com.startupvault.repository;

import com.startupvault.entity.Application;
import com.startupvault.entity.Startup;
import com.startupvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByStartupAndApplicant(Startup startup, User applicant);

    Optional<Application> findByStartupAndApplicant(Startup startup, User applicant);

    List<Application> findByApplicant(User applicant);

    @Query("""
        SELECT a FROM Application a
        WHERE a.startup.founder = :founder
    """)
    List<Application> findReceivedApplications(@Param("founder") User founder);

    long countByStartupAndStatus(Startup startup, Application.ApplicationStatus status);
}
