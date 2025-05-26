package org.ms.authentification.service;

import io.jsonwebtoken.Claims;
import org.ms.authentification.dto.AuthRequest;
import org.ms.authentification.dto.AuthResponse;
import org.ms.authentification.dto.LoginRequest;
import org.ms.authentification.dto.RegisterRequest;

public interface IAuthService {
    boolean validateToken(String token);
    Claims extractAllClaims(String token);
    AuthResponse authenticate(AuthRequest request);
    String authenticate(LoginRequest loginRequest);
    AuthResponse register(RegisterRequest request);
    String refreshToken(String refreshToken);
}