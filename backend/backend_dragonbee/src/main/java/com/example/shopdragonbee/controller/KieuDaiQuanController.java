package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.repository.KieuDaiQuanRepository;
import com.example.shopdragonbee.repository.KieuDangRepository;
import com.example.shopdragonbee.respone.KieuDaiQuanRespone;
import com.example.shopdragonbee.respone.KieuDangRespone;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/kieudaiquan")
@CrossOrigin(origins = "http://localhost:3000")
public class KieuDaiQuanController {

    private final KieuDaiQuanRepository kieuDaiQuanRepository;

    public KieuDaiQuanController(KieuDaiQuanRepository kieuDaiQuanRepository) {
        this.kieuDaiQuanRepository = kieuDaiQuanRepository;
    }

    // API lấy danh sách sản phẩm
    @GetMapping
    public List<KieuDaiQuanRespone> getAllKieuDaiQuan() {
        return kieuDaiQuanRepository.getAll();
    }
}
