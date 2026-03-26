package com.superpos.controller;

import com.superpos.config.AuthInterceptor;
import com.superpos.exception.InvalidCredentialsException;
import com.superpos.model.auth.TokenDetails;
import com.superpos.model.User;
import com.superpos.service.AuthTokenService;
import com.superpos.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(com.superpos.controller.advice.GlobalExceptionHandler.class)
class AuthControllerTest {

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private AuthTokenService authTokenService;

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
    void login_shouldReturnTokenAndUserInfo() throws Exception {
        User user = new User();
        user.setUsername("cashier");
        user.setPassword("hashed");
        user.setAdmin(false);

        when(userService.authenticate("cashier", "secret")).thenReturn(user);
        when(authTokenService.generateToken(user))
                .thenReturn(new TokenDetails("signed-token", 1_700_000_000L));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "username": "cashier",
                                    "password": "secret"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("signed-token"))
                .andExpect(jsonPath("$.username").value("cashier"))
                .andExpect(jsonPath("$.admin").value(false))
                .andExpect(jsonPath("$.expiresAt").value(1_700_000_000L));
    }

    @Test
    void login_shouldReturn401WhenCredentialsAreInvalid() throws Exception {
        doThrow(new InvalidCredentialsException())
                .when(userService)
                .authenticate("cashier", "wrong");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "username": "cashier",
                                    "password": "wrong"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("INVALID_CREDENTIALS"));
    }

}
