package com.superpos.model.auth;

public record AuthenticatedUser(String username, boolean admin, long expiresAt) {
}
