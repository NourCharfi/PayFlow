package org.ms.authentification.controller;

import org.ms.authentification.dto.AuthRequest;
import org.ms.authentification.dto.AuthResponse;
import org.ms.authentification.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.ms.authentification.service.AuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        Map<String, Object> user = new HashMap<>();
        user.put("username", response.getUsername());
        user.put("roles", response.getRoles());
        
        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        result.put("token", response.getToken());
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        Map<String, Object> user = new HashMap<>();
        user.put("username", response.getUsername());
        user.put("roles", response.getRoles());
        
        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        result.put("token", response.getToken());
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/public/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Authentication Service is running!");
    }
}
