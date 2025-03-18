package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.RevenueGrowthDTO;
import com.example.shopdragonbee.service.RevenueGrowthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/revenue")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RevenueGrowthController {

    private final RevenueGrowthService growthService;

    @GetMapping("/growth-all")
    public ResponseEntity<RevenueGrowthDTO> getGrowthAll() {
        RevenueGrowthDTO dto = growthService.getRevenueGrowth();
        return ResponseEntity.ok(dto);
    }
}
