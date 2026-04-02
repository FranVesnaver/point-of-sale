package com.superpos.config;

import com.superpos.exception.ForbiddenException;
import com.superpos.exception.UnauthorizedException;
import com.superpos.model.auth.AuthenticatedUser;
import com.superpos.service.AuthTokenService;
import com.superpos.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    public static final String AUTHENTICATED_USER = "authenticatedUser";

    private final AuthTokenService authTokenService;
    private final UserService userService;

    public AuthInterceptor(AuthTokenService authTokenService, UserService userService) {
        this.authTokenService = authTokenService;
        this.userService = userService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if (!path.startsWith("/api/") || "OPTIONS".equalsIgnoreCase(method) || isPublicEndpoint(path, method)) {
            return true;
        }

        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new UnauthorizedException("Missing bearer token");
        }

        AuthenticatedUser authenticatedUser =
                authTokenService.parseToken(authorization.substring(7).trim());

        if (requiresAdmin(path, method) && !authenticatedUser.admin()) {
            throw new ForbiddenException("Admin privileges are required");
        }

        request.setAttribute(AUTHENTICATED_USER, authenticatedUser);
        return true;
    }

    private boolean isPublicEndpoint(String path, String method) {
        if ("/api/auth/login".equals(path) && "POST".equalsIgnoreCase(method)) {
            return true;
        }

        if ("/api/auth/bootstrap".equals(path) && "GET".equalsIgnoreCase(method)) {
            return true;
        }

        return "/api/users".equals(path)
                && "POST".equalsIgnoreCase(method)
                && userService.thereAreNoAdmins();
    }

    private boolean requiresAdmin(String path, String method) {
        if (path.startsWith("/api/users")) {
            return true;
        }

        return path.startsWith("/api/products")
                && ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method));
    }

}
