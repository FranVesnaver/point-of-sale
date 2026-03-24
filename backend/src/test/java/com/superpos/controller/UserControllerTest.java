package com.superpos.controller;

import com.superpos.model.User;
import com.superpos.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @MockitoBean
    private UserService userService;

    @Autowired
    private MockMvc mockMvc;

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

}
