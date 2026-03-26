package com.superpos.service;

import com.superpos.exception.UnauthorizedException;
import com.superpos.model.auth.AuthenticatedUser;
import com.superpos.model.auth.TokenDetails;
import com.superpos.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
public class AuthTokenService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private final SecureRandom secureRandom = new SecureRandom();
    private final String secret;
    private final long tokenDurationSeconds;

    public AuthTokenService(
            @Value("${app.auth.token-secret:development-secret-change-me}") String secret,
            @Value("${app.auth.token-duration-hours:12}") long tokenDurationHours
    ) {
        this.secret = secret;
        this.tokenDurationSeconds = tokenDurationHours * 60 * 60;
    }

    public TokenDetails generateToken(User user) {
        long expiresAt = Instant.now().plusSeconds(tokenDurationSeconds).getEpochSecond();
        String nonce = randomNonce();
        String payload = String.join("\t",
                user.getUsername(),
                Boolean.toString(user.isAdmin()),
                Long.toString(expiresAt),
                nonce
        );

        String encodedPayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = sign(encodedPayload);

        return new TokenDetails(encodedPayload + "." + signature, expiresAt);
    }

    public AuthenticatedUser parseToken(String token) {
        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("Missing bearer token");
        }

        String[] parts = token.split("\\.");
        if (parts.length != 2) {
            throw new UnauthorizedException("Invalid bearer token");
        }

        String expectedSignature = sign(parts[0]);
        if (!MessageDigest.isEqual(
                expectedSignature.getBytes(StandardCharsets.UTF_8),
                parts[1].getBytes(StandardCharsets.UTF_8)
        )) {
            throw new UnauthorizedException("Invalid bearer token");
        }

        String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
        String[] payloadParts = payload.split("\t");
        if (payloadParts.length != 4) {
            throw new UnauthorizedException("Invalid bearer token");
        }

        long expiresAt = Long.parseLong(payloadParts[2]);
        if (Instant.now().getEpochSecond() > expiresAt) {
            throw new UnauthorizedException("Expired bearer token");
        }

        return new AuthenticatedUser(
                payloadParts[0],
                Boolean.parseBoolean(payloadParts[1]),
                expiresAt
        );
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
            byte[] signature = mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to sign auth token", e);
        }
    }

    private String randomNonce() {
        byte[] nonce = new byte[12];
        secureRandom.nextBytes(nonce);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(nonce);
    }

}
