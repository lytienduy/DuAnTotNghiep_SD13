package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.repository.DanhMucRepository;
import com.example.shopdragonbee.repository.PhongCachRepository;
import com.example.shopdragonbee.respone.DanhMucRespone;
import com.example.shopdragonbee.respone.DanhMucRespone2;
import com.example.shopdragonbee.respone.PhongCachRespone;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/danhmuc")
@CrossOrigin(origins = "*")

public class DanhMucController {

    private final DanhMucRepository danhMucRepository;

    public DanhMucController(DanhMucRepository danhMucRepository) {
        this.danhMucRepository = danhMucRepository;
    }

    // API lấy danh sách sản phẩm
    @GetMapping
    public List<DanhMucRespone> getAll() {
        return danhMucRepository.getAll();
    }
    @GetMapping("/dm2")
    public List<DanhMucRespone2> getAllDanhMuc() {
        return danhMucRepository.getAllDanhMuc();
    }
}
