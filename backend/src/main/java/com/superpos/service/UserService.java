package com.superpos.service;

import com.superpos.exception.ExistingUsernameException;
import com.superpos.exception.InvalidCredentialsException;
import com.superpos.model.User;
import com.superpos.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public UserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public User createUser(String username, String password, boolean admin) {
        if (userRepository.existsByUsername(username)) throw new ExistingUsernameException(username);

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordHasher.hash(password));
        user.setAdmin(admin);

        return userRepository.save(user);
    }

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
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

    public boolean hasUsers() {
        return userRepository.count() > 0;
    }

}
