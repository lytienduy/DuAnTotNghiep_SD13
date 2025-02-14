package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hoa-don")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép gọi API từ frontend
public class HoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

    @GetMapping("/loc")
    public List<HoaDonResponseDTO> filterInvoices(
            @RequestParam(required = false) String timKiem,
            @RequestParam(required = false) String tuNgay,
            @RequestParam(required = false) String denNgay,
            @RequestParam(required = false) String loaiDon,
            @RequestParam(required = false) String trangThai) {

        List<HoaDonResponseDTO> hoaDons = hoaDonService.locHoaDon(timKiem, tuNgay, denNgay, loaiDon, trangThai);
        return hoaDons;
    }

    @GetMapping
    public List<HoaDonResponseDTO> getHoaDons() {
        return hoaDonService.getAllHoaDons();
    }

}
