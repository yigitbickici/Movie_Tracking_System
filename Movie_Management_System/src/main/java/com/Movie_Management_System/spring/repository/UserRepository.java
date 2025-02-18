package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Finds a user by username (Optional prevents null-related errors)
    Optional<User> findByUsername(String username);

    // Finds a user by email (Optional prevents null-related errors)
    Optional<User> findByEmail(String email);

    // Checks if a user exists by username
    boolean existsByUsername(String username);

    // Checks if a user exists by email
    boolean existsByEmail(String email);
}
