package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.OrderStatusStatsDTO;
import com.example.shopdragonbee.service.HoaDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/order-status")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ThongKeHoaDon {
    private final HoaDonService hoaDonService;

    // Thống kê trạng thái đơn hàng trong ngày
    @GetMapping("/today")
    public ResponseEntity<List<OrderStatusStatsDTO>> getOrderStatusToday() {
        return ResponseEntity.ok(hoaDonService.getOrderStatusStatsToday());
    }

    // Thống kê trạng thái đơn hàng trong tuần
    @GetMapping("/week")
    public ResponseEntity<List<OrderStatusStatsDTO>> getOrderStatusThisWeek() {
        return ResponseEntity.ok(hoaDonService.getOrderStatusStatsThisWeek());
    }

    // Thống kê trạng thái đơn hàng trong tháng
    @GetMapping("/month")
    public ResponseEntity<List<OrderStatusStatsDTO>> getOrderStatusThisMonth() {
        return ResponseEntity.ok(hoaDonService.getOrderStatusStatsThisMonth());
    }

    // Thống kê trạng thái đơn hàng trong năm
    @GetMapping("/year")
    public ResponseEntity<List<OrderStatusStatsDTO>> getOrderStatusThisYear() {
        return ResponseEntity.ok(hoaDonService.getOrderStatusStatsThisYear());
    }
    /**
     * API thống kê trạng thái đơn hàng tùy chỉnh theo khoảng thời gian.
     * Ví dụ: GET /api/order-status/custom?startDate=2023-03-01&endDate=2023-03-15
     */
    @GetMapping("/custom")
    public ResponseEntity<List<OrderStatusStatsDTO>> getOrderStatusStatsCustom(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        List<OrderStatusStatsDTO> list = hoaDonService.getOrderStatusStatsCustom(startDate, endDate);
        return ResponseEntity.ok(list);
    }
}
