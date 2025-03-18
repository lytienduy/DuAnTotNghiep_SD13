package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.CustomRevenueDTO;
import com.example.shopdragonbee.respone.RevenueResponse;
import com.example.shopdragonbee.service.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/thong-ke")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Đảm bảo rằng React frontend đang chạy trên cổng này
public class ThongKeController {

    private final ThongKeService thongKeService;

    @GetMapping("/today")
    public ResponseEntity<?> getThongKeToday() {
        return ResponseEntity.ok(thongKeService.getThongKeHomNay());
    }

    @GetMapping("/week")
    public ResponseEntity<?> getThongKeThisWeek() {
        return ResponseEntity.ok(thongKeService.getThongKeTuanNay());
    }

    @GetMapping("/month")
    public ResponseEntity<?> getThongKeThisMonth() {
        return ResponseEntity.ok(thongKeService.getThongKeThangNay());
    }

    @GetMapping("/year")
    public ResponseEntity<?> getThongKeThisYear() {
        return ResponseEntity.ok(thongKeService.getThongKeNamNay());
    }

    @GetMapping("/custom-revenue")
    public ResponseEntity<Map<String, Object>> getCustomRevenue(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        Map<String, Object> result = thongKeService.getCustomRevenue(startDate, endDate);
        return ResponseEntity.ok(result);
    }
}
