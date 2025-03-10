package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.KieuDangDTO;
import com.example.shopdragonbee.dto.PhongCachDTO;
import com.example.shopdragonbee.service.KieuDangService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kieudang")
@CrossOrigin(origins = "http://localhost:3000")
public class KieuDangController {

    private final KieuDangService kieuDangService;

    public KieuDangController(KieuDangService kieuDangService) {
        this.kieuDangService = kieuDangService;
    }

    // API lấy danh sách kiểu dáng
    @GetMapping
    public List<KieuDangDTO> getAllKieuDang() {
        return kieuDangService.getAllKieuDang();
    }

    // API thêm kiểu dáng
    @PostMapping("/add")
    public String addKieuDang(@RequestBody KieuDangDTO kieuDangDTO) {
        return kieuDangService.addKieuDang(kieuDangDTO);
    }

    // api ds theo trạng thái
    @GetMapping("/kieu-dang/hoat-dong")
    public List<KieuDangDTO> getKieuDangByTrangThaiHoatDong() {
        return kieuDangService.getKieuDangByTrangThai("Hoạt động");
    }
}
