package com.superpos.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {

    private String token;
    private String username;
    private boolean admin;
    private long expiresAt;

}
