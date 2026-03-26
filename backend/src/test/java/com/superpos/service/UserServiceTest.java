package com.superpos.service;

import com.superpos.exception.ExistingUsernameException;
import com.superpos.model.User;
import com.superpos.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_shouldCreateAndSaveUser() {

        when(userRepository.existsByUsername("abc"))
                .thenReturn(false);

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.createUser(
                "abc",
                "123",
                true
        );

        assertEquals("abc", result.getUsername());
        assertEquals("123", result.getPassword());
        assertTrue(result.isAdmin());

        verify(userRepository).existsByUsername("abc");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_shouldThrowExceptionWhenUsernameExists() {

        when(userRepository.existsByUsername("abc"))
                .thenReturn(true);

        assertThrows(ExistingUsernameException.class, () ->
                userService.createUser(
                        "abc",
                        "123",
                        true
                )
        );

        verify(userRepository, never()).save(any());
    }

}