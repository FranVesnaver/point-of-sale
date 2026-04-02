package com.superpos.controller;

import com.superpos.dto.AuthResponse;
import com.superpos.dto.BootstrapResponse;
import com.superpos.dto.LoginRequest;
import com.superpos.exception.UnauthorizedException;
import com.superpos.model.auth.TokenDetails;
import com.superpos.model.User;
import com.superpos.service.AuthTokenService;
import com.superpos.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthTokenService authTokenService;

    public AuthController(UserService userService, AuthTokenService authTokenService) {
        this.userService = userService;
        this.authTokenService = authTokenService;
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        User user = userService.authenticate(request.getUsername(), request.getPassword());
        TokenDetails tokenDetails = authTokenService.generateToken(user);

        return toResponse(user, tokenDetails);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
            @RequestHeader("Authorization") String authorization
    ) {
        authTokenService.revokeToken(extractBearerToken(authorization));
    }

    @GetMapping("/bootstrap")
    public BootstrapResponse isBoostrap() {
        BootstrapResponse response = new BootstrapResponse();
        response.setIsBoostrap(userService.thereAreNoAdmins());
        return response;
    }

    private AuthResponse toResponse(User user, TokenDetails tokenDetails) {
        AuthResponse response = new AuthResponse();
        response.setToken(tokenDetails.token());
        response.setUsername(user.getUsername());
        response.setAdmin(user.isAdmin());
        response.setExpiresAt(tokenDetails.expiresAt());
        return response;
    }

    private String extractBearerToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new UnauthorizedException("Missing bearer token");
        }

        return authorization.substring(7).trim();
    }

}
