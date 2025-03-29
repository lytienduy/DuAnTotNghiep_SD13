package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.MauSacDTO;
import com.example.shopdragonbee.dto.XuatXuDTO;
import com.example.shopdragonbee.entity.MauSac;
import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.repository.MauSacRepository;
import com.example.shopdragonbee.respone.ChatLieuRespone;
import com.example.shopdragonbee.respone.MauSacRespone;
import com.example.shopdragonbee.service.MauSacService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mausac")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class MauSacController {

    private final MauSacRepository mauSacRepository;
    private final MauSacService mauSacService;



    // API lấy danh sách sản phẩm
    @GetMapping
    public List<MauSacRespone> getAllMauSac() {
        return mauSacRepository.getAll();
    }
    // api ds theo trạng thái
    @GetMapping("/mau-sac/hoat-dong")
    public List<MauSacDTO> getMauSacTrangThaiHoatDong() {
        return mauSacService.getMauSacByTrangThai("Hoạt động");
    }
    //add
    @PostMapping("/add-mau")
    public MauSac addColor(@RequestBody MauSac mauSac) {
        return mauSacService.addColor(mauSac);
    }
}
