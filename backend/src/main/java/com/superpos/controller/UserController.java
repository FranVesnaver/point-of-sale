package com.superpos.controller;

import com.superpos.dto.CreateUserRequest;
import com.superpos.dto.UserResponse;
import com.superpos.model.User;
import com.superpos.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponse createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {

        User user = userService.createUser(
                request.getUsername(),
                request.getPassword(),
                request.isAdmin()
        );

        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setUsername(user.getUsername());
        userResponse.setAdmin(user.isAdmin());
        return userResponse;
    }

}
