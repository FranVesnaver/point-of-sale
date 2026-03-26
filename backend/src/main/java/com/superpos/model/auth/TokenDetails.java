package com.superpos.model.auth;

public record TokenDetails(String token, long expiresAt) {}
