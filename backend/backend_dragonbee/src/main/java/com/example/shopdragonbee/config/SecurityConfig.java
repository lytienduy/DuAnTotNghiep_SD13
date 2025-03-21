//package com.example.shopdragonbee.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        // Cấu hình CORS và các yêu cầu bảo mật
//        http.cors().and() // Cấu hình CORS
//                .authorizeHttpRequests(authz -> authz
//                        .requestMatchers("/api/**").permitAll() // Cho phép tất cả các endpoint bắt đầu với /api/
//                        .anyRequest().authenticated()  // Yêu cầu xác thực cho các endpoint khác
//                )
//                .csrf().disable();  // Tắt CSRF nếu không sử dụng trong API
//
//        return http.build();
//    }
//
//}
