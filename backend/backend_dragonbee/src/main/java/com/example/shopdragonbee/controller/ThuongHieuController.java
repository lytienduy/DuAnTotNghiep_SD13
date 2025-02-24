package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.service.ThuongHieuService;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thuonghieu")
@CrossOrigin(origins = "http://localhost:3000")
public class ThuongHieuController {

    private final ThuongHieuService thuongHieuService;

    public ThuongHieuController(ThuongHieuService thuongHieuService) {
        this.thuongHieuService = thuongHieuService;
    }

    // API lấy danh sách thương hiệu
    @GetMapping
    public List<ThuongHieuDTO> getAllThuongHieu() {
        return thuongHieuService.getAllThuongHieu();
    }

    // API thêm thương hiệu
    @PostMapping("/add")
    public ResponseEntity<?> addThuongHieu(@RequestBody ThuongHieuDTO thuongHieuDTO) {
        return thuongHieuService.addThuongHieu(thuongHieuDTO.getTenThuongHieu(), thuongHieuDTO.getMoTa());
    }
    // api show ds theo trạng thái
    @GetMapping("/thuong-hieu/hoat-dong")
    public List<ThuongHieuDTO> getThuongHieuByTrangThaiHoatDong() {
        return thuongHieuService.getThuongHieuByTrangThai("Hoạt động");
    }
}
