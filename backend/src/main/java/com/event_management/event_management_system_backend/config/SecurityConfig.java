package com.event_management.event_management_system_backend.config;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserAuthenticationProvider userAuthenticationProvider;
    private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Permitir Flutter Web en localhost con cualquier puerto
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*"
        ));

        // Métodos HTTP permitidos
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        // Encabezados permitidos
        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type"
        ));

        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        JWTAuthFilter jwtAuthFilter =
                new JWTAuthFilter(userAuthenticationProvider);

        http
                // Habilitar CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())

                .exceptionHandling(e ->
                        e.authenticationEntryPoint(userAuthenticationEntryPoint)
                )

                .sessionManagement(s ->
                        s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // Permitir preflight CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Autenticación y registro
                        .requestMatchers(
                                HttpMethod.POST,
                                "/login",
                                "/register",
                                "/addattendee"
                        ).permitAll()

                        // Eventos públicos
                        .requestMatchers(
                                HttpMethod.GET,
                                "/getallevents"
                        ).permitAll()

                        // Predicciones
                        .requestMatchers("/api/predict/**").permitAll()

                        // IA
                        .requestMatchers("/ai/**").permitAll()

                        // MCP
                        .requestMatchers(
                                HttpMethod.GET,
                                "/mcp/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/mcp/**"
                        ).permitAll()

                        .anyRequest().permitAll()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
