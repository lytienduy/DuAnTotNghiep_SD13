package com.example.shopdragonbee.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // Các endpoint API bạn muốn cho phép CORS
                .allowedOrigins("http://localhost:3000")  // URL frontend của bạn
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Các phương thức HTTP bạn muốn cho phép
                .allowedHeaders("*");  // Cho phép tất cả các header
    }
}
