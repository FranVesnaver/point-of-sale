package com.superpos.exception;

public class FirstUserIsNotAdminException extends RuntimeException {
    public FirstUserIsNotAdminException() {
        super("The first user in the system must be administrator");
    }
}
