package com.superpos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    @Setter
    private String username;

    @NotBlank
    @Column(nullable = false)
    @Setter
    private String password;

    @Column(name = "is_admin", nullable = false)
    @Setter
    private boolean admin;

}
