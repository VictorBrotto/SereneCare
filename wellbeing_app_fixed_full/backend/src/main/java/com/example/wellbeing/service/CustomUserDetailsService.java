package com.example.wellbeing.service;

import com.example.wellbeing.model.User;
import com.example.wellbeing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {
        // Tenta encontrar pelo username primeiro
        User user = userRepository.findByUsername(input)
                // Se não achar, tenta pelo email
                .orElseGet(() -> userRepository.findByEmail(input)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + input)));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole() != null ? user.getRole() : "ROLE_USER"))
        );
    }
}
