package com.startupvault.service;

import com.startupvault.dto.AuthResponse;
import com.startupvault.dto.LoginRequest;
import com.startupvault.dto.RegisterRequest;
import com.startupvault.dto.UserDto;
import com.startupvault.entity.Profile;
import com.startupvault.entity.User;
import com.startupvault.exception.ApiException;
import com.startupvault.repository.ProfileRepository;
import com.startupvault.repository.UserRepository;
import com.startupvault.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.conflict("Email already registered");
        }

        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(User.Role.ROLE_USER)
            .build();
        user = userRepository.save(user);

        // Auto-create profile
        Profile profile = Profile.builder().user(user).build();
        profileRepository.save(profile);

        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
            .token(token)
            .user(toUserDto(user))
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> ApiException.notFound("User not found"));
        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
            .token(token)
            .user(toUserDto(user))
            .build();
    }

    public UserDto getMe(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> ApiException.notFound("User not found"));
        return toUserDto(user);
    }

    private UserDto toUserDto(User user) {
        return UserDto.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .build();
    }
}
