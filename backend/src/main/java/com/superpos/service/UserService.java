package com.superpos.service;

import com.superpos.exception.ExistingUsernameException;
import com.superpos.exception.FirstUserIsNotAdminException;
import com.superpos.exception.InvalidCredentialsException;
import com.superpos.model.User;
import com.superpos.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public UserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public User createUser(String username, String password, boolean IsAdmin) {
        if (thereAreNoAdmins() && !IsAdmin) throw new FirstUserIsNotAdminException();

        String normalizedUsername = normalizeUsername(username);

        if (userRepository.existsByUsername(normalizedUsername)) throw new ExistingUsernameException(normalizedUsername);

        User user = new User();
        user.setUsername(normalizedUsername);
        user.setPassword(passwordHasher.hash(password));
        user.setAdmin(IsAdmin);

        return userRepository.save(user);
    }

    public User authenticate(String username, String password) {
        String normalizedUsername = normalizeUsername(username);

        User user = userRepository.findByUsername(normalizedUsername)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordHasher.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        if (!passwordHasher.isHashed(user.getPassword())) {
            user.setPassword(passwordHasher.hash(password));
            return userRepository.save(user);
        }

        return user;
    }

    public boolean thereAreNoAdmins() {
        return userRepository.countByAdminTrue() == 0;
    }

    private String normalizeUsername(String username) {
        return username.trim().toLowerCase(Locale.ROOT);
    }
}
