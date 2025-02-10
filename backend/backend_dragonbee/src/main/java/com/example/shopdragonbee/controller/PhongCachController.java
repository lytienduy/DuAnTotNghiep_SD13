package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.repository.PhongCachRepository;
import com.example.shopdragonbee.respone.ChatLieuRespone;
import com.example.shopdragonbee.respone.PhongCachRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/phongcach")
@CrossOrigin(origins = "http://localhost:3000")
public class PhongCachController {

    private final PhongCachRepository phongCachRepository;

    public PhongCachController(PhongCachRepository phongCachRepository) {
        this.phongCachRepository = phongCachRepository;
    }

    // API lấy danh sách sản phẩm
    @GetMapping
    public List<PhongCachRespone> getAllPhongCach() {
        return phongCachRepository.getAll();
    }

}
