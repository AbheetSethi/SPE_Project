package com.teledermatology.admin.security.config;

import com.teledermatology.admin.security.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static java.util.Objects.isNull;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String jwt = getJwtFromCookie(request);
        //final String authHeader = request.getHeader("Authorization");
        //if(isNull(authHeader) || "".equals(authHeader) || !authHeader.startsWith("Bearer ")){
        if(isNull(jwt)){
            filterChain.doFilter(request,response);
            return;
        }
        //final String jwt = authHeader.substring(7);

        System.out.println("Token from bearer:"+ jwt);
        final String userEmail = jwtService.extractUsername(jwt);
        if(!isNull(userEmail) && isNull(SecurityContextHolder.getContext().getAuthentication())){
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            if(jwtService.isTokenValid(jwt,userDetails)){
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }

    private String getJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if(isNull(cookies) || cookies.length == 0){
            return null;
        }
        for (Cookie cookie : cookies) {
            if ("token".equals(cookie.getName())) {
                String accessToken = cookie.getValue();
                if (accessToken == null) {
                    return null;
                }
                return accessToken;
            }
        }
        return null;
    }
}
