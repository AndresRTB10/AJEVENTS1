package com.event_management.event_management_system_backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserAuthenticationProvider userAuthenticationProvider;
    private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        JWTAuthFilter jwtAuthFilter = new JWTAuthFilter(userAuthenticationProvider);

        http
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(e -> e.authenticationEntryPoint(userAuthenticationEntryPoint))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.POST, "/login", "/register", "/addattendee").permitAll()
                        .requestMatchers(HttpMethod.GET, "/getallevents").permitAll()
                        .requestMatchers("/api/predict/**").permitAll()
                        .requestMatchers("/ai/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/mcp/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/mcp/**").permitAll()



                        .anyRequest().permitAll()
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
