package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.TopProductDTO;
import com.example.shopdragonbee.service.TopProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/top-products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Cho phép React truy cập API
public class TopProductController {
    private final TopProductService service;

    @GetMapping("/today")
    public ResponseEntity<List<TopProductDTO>> getTopProductsToday() {
        return ResponseEntity.ok(service.getTopProductsToday());
    }

    @GetMapping("/week")
    public ResponseEntity<List<TopProductDTO>> getTopProductsThisWeek() {
        return ResponseEntity.ok(service.getTopProductsThisWeek());
    }

    @GetMapping("/month")
    public ResponseEntity<List<TopProductDTO>> getTopProductsThisMonth() {
        return ResponseEntity.ok(service.getTopProductsThisMonth());
    }

    @GetMapping("/year")
    public ResponseEntity<List<TopProductDTO>> getTopProductsThisYear() {
        return ResponseEntity.ok(service.getTopProductsThisYear());
    }

    /**
     * Thống kê top sản phẩm bán chạy theo khoảng thời gian tùy chỉnh
     * Ví dụ: /api/top-products/custom?startDate=2023-01-01&endDate=2023-01-31
     */
    @GetMapping("/custom")
    public ResponseEntity<List<TopProductDTO>> getTopProductsBetween(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate
    ) {
        List<TopProductDTO> list = service.getTopProductsBetween(startDate, endDate);
        return ResponseEntity.ok(list);
    }
}

