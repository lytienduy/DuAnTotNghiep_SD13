package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.SanPhamChiTietDTO;
import com.example.shopdragonbee.dto.SanPhamChiTietUpdateDTO;
import com.example.shopdragonbee.service.SanPhamChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/san-pham-chi-tiet")
public class SanPhamChiTietController {

    @Autowired
    private SanPhamChiTietService sanPhamChiTietService;
    @GetMapping("/{id}")
    public ResponseEntity<SanPhamChiTietDTO> getSanPhamChiTiet(@PathVariable Integer id) {
        SanPhamChiTietDTO sanPhamChiTietDTO = sanPhamChiTietService.getSanPhamChiTietById(id);
        return ResponseEntity.ok(sanPhamChiTietDTO);
    }

    // update 1 sản phẩm chi tiết
    @PutMapping("/{id}")
    public ResponseEntity<SanPhamChiTietDTO> updateSanPhamChiTiet(@PathVariable Integer id,
                                                                  @RequestBody SanPhamChiTietUpdateDTO request) {
        System.out.println("Dữ liệu nhận từ frontend: " + request); // Kiểm tra dữ liệu từ frontend
        return ResponseEntity.ok(sanPhamChiTietService.updateSanPhamChiTiet(id, request));
    }
// search
@GetMapping("/search")
public ResponseEntity<List<SanPhamChiTietDTO>> searchSanPham(
        @RequestParam(required = false) String tenSanPham,
        @RequestParam(required = false) Integer danhMucId,
        @RequestParam(required = false) Integer thuongHieuId,
        @RequestParam(required = false) Integer phongCachId,
        @RequestParam(required = false) Integer chatLieuId,
        @RequestParam(required = false) Integer kieuDangId,
        @RequestParam(required = false) Integer kieuDaiQuanId,
        @RequestParam(required = false) Integer xuatXuId,
        @RequestParam(required = false) Integer mauSacId,
        @RequestParam(required = false) Integer sizeId,
        @RequestParam(required = false) Double giaMin,
        @RequestParam(required = false) Double giaMax) {

    List<SanPhamChiTietDTO> result = sanPhamChiTietService.searchSanPham(tenSanPham, danhMucId, thuongHieuId, phongCachId, chatLieuId, kieuDangId, kieuDaiQuanId, xuatXuId, mauSacId, sizeId, giaMin, giaMax);
    return ResponseEntity.ok(result);
}
}
