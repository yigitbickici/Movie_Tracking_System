package com.Movie_Management_System.spring.security.jwt;

import java.util.Date;

import com.Movie_Management_System.spring.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${movie.app.jwtSecret}")
    private String jwtSecret;

    @Value("${movie.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    // JWT Token üretimi
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .claim("role", "ROLE_" + userPrincipal.getRole().name()) // Role bilgisi eklendi
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    // Kullanıcı adını token'dan al
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtSecret.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Token doğrulama
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(jwtSecret.getBytes())
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (Exception e) {
            logger.error("JWT Hatası: {}", e.getMessage());
        }
        return false;
    }

    // 🔥 Eksik olan getJwtSecret metodu eklendi (AuthTokenFilter için lazım)
    public String getJwtSecret() {
        return jwtSecret;
    }
}
