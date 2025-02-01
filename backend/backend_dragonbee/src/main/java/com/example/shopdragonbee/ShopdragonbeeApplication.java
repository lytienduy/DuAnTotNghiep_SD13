package com.example.shopdragonbee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ShopdragonbeeApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopdragonbeeApplication.class, args);
    }

}
