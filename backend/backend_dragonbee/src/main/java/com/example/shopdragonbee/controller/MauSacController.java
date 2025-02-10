package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.repository.MauSacRepository;
import com.example.shopdragonbee.respone.ChatLieuRespone;
import com.example.shopdragonbee.respone.MauSacRespone;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mausac")
@CrossOrigin(origins = "http://localhost:3000")
public class MauSacController {

    private final MauSacRepository mauSacRepository;

    public MauSacController(MauSacRepository mauSacRepository) {
        this.mauSacRepository = mauSacRepository;
    }

    // API lấy danh sách sản phẩm
    @GetMapping
    public List<MauSacRespone> getAllMauSac() {
        return mauSacRepository.getAll();
    }
}
