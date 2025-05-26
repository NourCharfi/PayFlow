package org.ms.authentification;

import org.ms.authentification.entity.Role;
import org.ms.authentification.entity.User;
import org.ms.authentification.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthenticationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthenticationServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner initializeAdminUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Only create admin if no users exist
            if (userRepository.count() == 0) {
                Set<Role> roles = new HashSet<>();
                roles.add(Role.ROLE_ADMIN);
                roles.add(Role.ROLE_USER);

                User adminUser = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .email("admin@payflow.com")
                        .firstName("Admin")
                        .lastName("User")
                        .roles(roles)
                        .build();

                userRepository.save(adminUser);
                System.out.println("Admin user created successfully");
            }
        };
    }
}
