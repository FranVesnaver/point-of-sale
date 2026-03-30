package com.superpos.service;

import com.superpos.exception.ExistingUsernameException;
import com.superpos.exception.FirstUserIsNotAdminException;
import com.superpos.exception.InvalidCredentialsException;
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

    @Mock
    private PasswordHasher passwordHasher;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_shouldCreateAndSaveUser() {
        when(userRepository.count())
                .thenReturn(1L);

        when(userRepository.existsByUsername("abc"))
                .thenReturn(false);

        when(passwordHasher.hash("123"))
                .thenReturn("hashed-password");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.createUser(
                "abc",
                "123",
                true
        );

        assertEquals("abc", result.getUsername());
        assertEquals("hashed-password", result.getPassword());
        assertTrue(result.isAdmin());

        verify(userRepository).existsByUsername("abc");
        verify(passwordHasher).hash("123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_shouldNormalizeUsernameBeforeCheckingAndSaving() {
        when(userRepository.count())
                .thenReturn(1L);

        when(userRepository.existsByUsername("abc"))
                .thenReturn(false);

        when(passwordHasher.hash("123"))
                .thenReturn("hashed-password");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.createUser(
                "  AbC  ",
                "123",
                true
        );

        assertEquals("abc", result.getUsername());
        verify(userRepository).existsByUsername("abc");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_shouldThrowExceptionWhenFirstUserIsNotAdmin() {
        when(userRepository.countByAdminTrue())
                .thenReturn(0L);

        assertThrows(FirstUserIsNotAdminException.class, () ->
                userService.createUser(
                        "abc",
                        "123",
                        false
                )
        );

        verify(userRepository, never()).existsByUsername(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void createUser_shouldThrowExceptionWhenUsernameExists() {
        when(userRepository.count())
                .thenReturn(1L);

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

    @Test
    void authenticate_shouldReturnUserWhenCredentialsAreValid() {
        User user = new User();
        user.setUsername("cashier");
        user.setPassword("hashed");
        user.setAdmin(false);

        when(userRepository.findByUsername("cashier")).thenReturn(java.util.Optional.of(user));
        when(passwordHasher.matches("secret", "hashed")).thenReturn(true);
        when(passwordHasher.isHashed("hashed")).thenReturn(true);

        User result = userService.authenticate("cashier", "secret");

        assertEquals(user, result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void authenticate_shouldNormalizeUsernameBeforeSearching() {
        User user = new User();
        user.setUsername("cashier");
        user.setPassword("hashed");
        user.setAdmin(false);

        when(userRepository.findByUsername("cashier")).thenReturn(java.util.Optional.of(user));
        when(passwordHasher.matches("secret", "hashed")).thenReturn(true);
        when(passwordHasher.isHashed("hashed")).thenReturn(true);

        User result = userService.authenticate("  CaShIeR  ", "secret");

        assertEquals(user, result);
        verify(userRepository).findByUsername("cashier");
    }

    @Test
    void authenticate_shouldRehashLegacyPlaintextPassword() {
        User user = new User();
        user.setUsername("cashier");
        user.setPassword("secret");
        user.setAdmin(false);

        when(userRepository.findByUsername("cashier")).thenReturn(java.util.Optional.of(user));
        when(passwordHasher.matches("secret", "secret")).thenReturn(true);
        when(passwordHasher.isHashed("secret")).thenReturn(false);
        when(passwordHasher.hash("secret")).thenReturn("rehash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.authenticate("cashier", "secret");

        assertEquals("rehash", result.getPassword());
        verify(userRepository).save(user);
    }

    @Test
    void authenticate_shouldThrowExceptionWhenCredentialsAreInvalid() {
        User user = new User();
        user.setUsername("cashier");
        user.setPassword("hashed");

        when(userRepository.findByUsername("cashier")).thenReturn(java.util.Optional.of(user));
        when(passwordHasher.matches("wrong", "hashed")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> userService.authenticate("cashier", "wrong"));
    }

}
