package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.repository.DanhMucRepository;
import com.example.shopdragonbee.repository.ThuongHieuRepository;
import com.example.shopdragonbee.respone.DanhMucRespone;
import com.example.shopdragonbee.respone.ThuongHieuRespone;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/thuonghieu")
@CrossOrigin(origins = "http://localhost:3000")
public class ThuongHieuController {

    private final ThuongHieuRepository thuongHieuRepository;

    public ThuongHieuController(ThuongHieuRepository thuongHieuRepository) {
        this.thuongHieuRepository = thuongHieuRepository;
    }

    // API lấy danh sách sản phẩm
    @GetMapping
    public List<ThuongHieuRespone> getAllThuongHieu() {
        return thuongHieuRepository.getAll();
    }
}
