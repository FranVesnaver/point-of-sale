package com.superpos.controller;

import com.superpos.config.AuthInterceptor;
import com.superpos.exception.ExistingUsernameException;
import com.superpos.model.User;
import com.superpos.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private AuthInterceptor authInterceptor;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void allowInterceptor() {
        when(authInterceptor.preHandle(any(HttpServletRequest.class), any(HttpServletResponse.class), any()))
                .thenReturn(true);
    }

    @Test
    void createUser_shouldReturn200AndUser() throws Exception {
        User user = new User();
        user.setUsername("abc");
        user.setPassword("password");
        user.setAdmin(true);

        when(userService.createUser("abc", "password", true))
                .thenReturn(user);

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "username": "abc",
                            "password": "password",
                            "admin": true
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("username").value("abc"))
                .andExpect(jsonPath("admin").value(true));

        verify(userService).createUser("abc", "password", true);
    }

    @Test
    void createProduct_shouldReturn409WhenTheUsernameAlreadyExists() throws Exception {

        doThrow(new ExistingUsernameException("123"))
                .when(userService)
                .createUser(eq("abc"), eq("123"), eq(true));

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "username": "abc",
                            "password": "123",
                            "admin": true
                        }
                        """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("EXISTING_USERNAME"));
    }

}
