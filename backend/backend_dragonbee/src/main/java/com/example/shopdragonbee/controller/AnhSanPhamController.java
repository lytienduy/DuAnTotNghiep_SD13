package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.service.AnhSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anh-san-pham")
public class AnhSanPhamController {

    @Autowired
    private AnhSanPhamService anhSanPhamService;

    // API thêm nhiều ảnh cho sản phẩm chi tiết
    @PostMapping("/{sanPhamChiTietId}")
    public ResponseEntity<List<AnhSanPham>> addAnhs(@PathVariable Integer sanPhamChiTietId, @RequestBody List<AnhSanPham> anhSanPhamList) {
        // Thêm id_san_pham_chi_tiet vào mỗi ảnh trong danh sách
        for (AnhSanPham anhSanPham : anhSanPhamList) {
            anhSanPham.setSanPhamChiTiet(SanPhamChiTiet.builder().id(sanPhamChiTietId).build());
        }

        List<AnhSanPham> newAnhs = anhSanPhamService.addAnhsToSanPhamChiTiet(sanPhamChiTietId, anhSanPhamList);
        return ResponseEntity.ok(newAnhs);
    }

    // API lấy tất cả ảnh của một sản phẩm chi tiết
    @GetMapping("/{sanPhamChiTietId}")
    public ResponseEntity<List<AnhSanPham>> getAllAnh(@PathVariable Integer sanPhamChiTietId) {
        List<AnhSanPham> anhList = anhSanPhamService.getAllAnhBySanPhamChiTietId(sanPhamChiTietId);
        return ResponseEntity.ok(anhList);
    }
}
