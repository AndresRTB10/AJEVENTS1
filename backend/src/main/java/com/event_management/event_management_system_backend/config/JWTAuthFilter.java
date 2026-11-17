package com.event_management.event_management_system_backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpHeaders;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@RequiredArgsConstructor
public class JWTAuthFilter extends OncePerRequestFilter {

    private final UserAuthenticationProvider userAuthenticationProvider;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return path.startsWith("/ai/")
                || path.startsWith("/login")
                || path.startsWith("/register")
                || path.startsWith("/getallevents")
                || path.startsWith("/api/predict")
                || path.startsWith("/mcp/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws IOException, ServletException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                SecurityContextHolder.getContext().setAuthentication(
                        userAuthenticationProvider.validateToken(token)
                );
            } catch (RuntimeException e) {
                SecurityContextHolder.clearContext();
                // ✅ NO lanzar excepción
            }
        }

        filterChain.doFilter(request, response);
    }
}