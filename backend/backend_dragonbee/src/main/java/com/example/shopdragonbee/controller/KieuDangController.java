package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.repository.KieuDangRepository;
import com.example.shopdragonbee.repository.ThuongHieuRepository;
import com.example.shopdragonbee.respone.KieuDaiQuanRespone;
import com.example.shopdragonbee.respone.KieuDangRespone;
import com.example.shopdragonbee.respone.ThuongHieuRespone;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/kieudang")
@CrossOrigin(origins = "http://localhost:3000")
public class KieuDangController {

    private final KieuDangRepository kieuDangRepository;

    public KieuDangController(KieuDangRepository kieuDangRepository) {
        this.kieuDangRepository = kieuDangRepository;
    }

    // API lấy danh sách sản phẩm
    @GetMapping
    public List<KieuDangRespone> getAllKieuDang() {
        return kieuDangRepository.getAll();
    }
}
