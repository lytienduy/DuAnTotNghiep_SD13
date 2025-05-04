package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.service.HoaDonChiTietService;
import com.example.shopdragonbee.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hoa-don-chi-tiet")
// Cho phép gọi API từ frontend
//@CrossOrigin(origins = "*")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class HoaDonChiTietController {

    @Autowired
    private HoaDonChiTietService hoaDonChiTietService;

    @GetMapping("/{id}")
    public HoaDonChiTietResponseDTO.HoaDonChiTietDTO getHoaDonById(@PathVariable Integer id) {
        return hoaDonChiTietService.getHoaDonById(id);
    }

    @PostMapping("/hoanTien/{id}")
    public Boolean xacNhanHoanfTien(@PathVariable Integer id, @RequestParam Float soTienCanHoan, @RequestParam String tenUser) {
        return hoaDonChiTietService.xacNhanHoanTien(id, soTienCanHoan, tenUser);
    }
}
