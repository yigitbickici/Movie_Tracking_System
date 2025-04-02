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
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        System.out.println("Attempting to load user with login: " + login);
        
        User user = userRepository.findByEmail(login)
                .orElseGet(() -> userRepository.findByUsername(login)
                        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with login: " + login)));

        System.out.println("Found user: " + user.getUsername() + ", email: " + user.getEmail());
        System.out.println("User password hash: " + user.getPassword());

        return UserDetailsImpl.build(user);
    }
} 