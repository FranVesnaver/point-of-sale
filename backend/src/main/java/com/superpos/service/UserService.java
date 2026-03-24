package com.superpos.service;

import com.superpos.exception.ExistingUsernameException;
import com.superpos.model.User;
import com.superpos.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String username, String password, boolean admin) {
        if (userRepository.existsByUsername(username)) throw new ExistingUsernameException(username);

        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setAdmin(admin);

        return userRepository.save(user);
    }
}
