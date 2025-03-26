package com.Movie_Management_System.spring.security.services;

import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        System.out.println("Loading user with username: " + username); // Debug için log
        System.out.println("User found: " + user.getUsername() + ", password: [PROTECTED]"); // Debug için log

        return UserDetailsImpl.build(user);
    }
} 