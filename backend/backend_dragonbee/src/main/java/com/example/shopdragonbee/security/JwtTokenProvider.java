package com.example.shopdragonbee.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("7200000")
    private long jwtExpiration;

    @Value("86400000")
    private long refreshExpiration;

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String generateRefreshToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpiration);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public Claims getClaimsFromToken(String token) {
        // Sử dụng JwtParser.builder() thay vì Jwts.parser()
        JwtParser jwtParser = Jwts.parser()  // Chắc chắn bạn đã sử dụng đúng phương thức parserBuilder()
                .setSigningKey(jwtSecret)  // Cung cấp khóa bí mật để xác thực token
                .build();  // Xây dựng đối tượng JwtParser
        return jwtParser.parseClaimsJws(token).getBody();  // Giải mã token và lấy Claims
    }


    public boolean validateToken(String token) {
        try {
            getClaimsFromToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }
}
