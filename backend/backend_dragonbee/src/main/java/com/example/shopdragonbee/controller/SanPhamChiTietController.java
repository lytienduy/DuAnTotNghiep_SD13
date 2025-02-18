package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.service.SanPhamChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/san-pham-chi-tiet")
public class SanPhamChiTietController {

    @Autowired
    private SanPhamChiTietService sanPhamChiTietService;

    @PostMapping("/add")
    public ResponseEntity<?> addSanPhamChiTiet(@RequestBody SanPhamChiTiet newSanPhamChiTiet) {
        try {
            SanPhamChiTiet savedProduct = sanPhamChiTietService.addSanPhamChiTiet(newSanPhamChiTiet);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi thêm sản phẩm chi tiết", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
