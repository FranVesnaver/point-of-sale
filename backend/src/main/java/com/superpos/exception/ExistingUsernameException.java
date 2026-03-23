package com.superpos.exception;

public class ExistingUsernameException extends RuntimeException {
    public ExistingUsernameException(String username) {
        super("The username already exists for another user: " + username);
    }
}
