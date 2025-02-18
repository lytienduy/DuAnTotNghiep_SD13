package com.example.shopdragonbee.controller;


import com.example.shopdragonbee.dto.SanPhamChiTietDTO;
import com.example.shopdragonbee.dto.SanPhamDTO;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.repository.DanhMucRepository;
import com.example.shopdragonbee.repository.MauSacRepository;
import com.example.shopdragonbee.repository.SizeRepository;
import com.example.shopdragonbee.repository.ThuongHieuRepository;
import com.example.shopdragonbee.respone.SanPhamRespone;
import com.example.shopdragonbee.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/sanpham")

public class SanPhamController {

    private final SanPhamService sanPhamService;
    @Autowired
    public SanPhamController(SanPhamService sanPhamService) {
        this.sanPhamService = sanPhamService;
    }

//    private final SanPhamRepository sanPhamRepository;
//    private final SanPhamChiTietRepository sanPhamChiTietRepository;
    @Autowired
    private MauSacRepository mauSacRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private DanhMucRepository danhMucRepository;

    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    @Autowired
    private ChatLieuRepository chatLieuRepository;

    // API lấy tất cả sản phẩm (không phân trang)
    @GetMapping("/all")
    public ResponseEntity<List<SanPhamRespone>> getAllSanPham() {
        List<SanPhamRespone> sanPhams = sanPhamService.getAllSanPham();
        return ResponseEntity.ok(sanPhams);
    }

    // API lấy tất cả sản phẩm có phân trang
    @GetMapping("/paged")
    public ResponseEntity<Page<SanPhamRespone>> getAllSanPhamPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamRespone> sanPhams = sanPhamService.getAllSanPhamPaged(pageable);
        return ResponseEntity.ok(sanPhams);
    }

    @GetMapping("/{id}/chi-tiet")
    public ResponseEntity<?> getSanPhamChiTietBySanPhamId(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        if (page != null && size != null) {
            // Lấy chi tiết sản phẩm có phân trang
            return ResponseEntity.ok(sanPhamService.getChiTietSanPhamPaged(page, size));
        } else {
            // Lấy chi tiết sản phẩm không phân trang
            return ResponseEntity.ok(sanPhamService.getChiTietSanPhamById(id));
        }
    }

    // add sản phẩm
    @PostMapping("/add/sanpham")
    public ResponseEntity<?> addSanPham(@RequestBody SanPham sanPham) {
        try {
            SanPham newSanPham = sanPhamService.addSanPham(sanPham);
            return ResponseEntity.ok(newSanPham);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

// api tìm kiếm và bộ lọc

    @GetMapping("/search")
    public ResponseEntity<Page<SanPhamRespone>> searchSanPham(
            @RequestParam(required = false) String tenSanPham,
            @RequestParam(required = false) String trangThai,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamRespone> result = sanPhamService.searchSanPham(tenSanPham, trangThai, pageable);

        return ResponseEntity.ok(result);
    }
    @PutMapping("/{id}/sua-sp")
    public ResponseEntity<SanPhamChiTiet> updateSanPhamChiTiet(@PathVariable Integer id,
                                                               @RequestBody SanPhamChiTietDTO sanPhamChiTietDTO) {
        SanPhamChiTiet updatedSanPhamChiTiet = sanPhamService.updateSanPhamChiTiet(id, sanPhamChiTietDTO);

        if (updatedSanPhamChiTiet != null) {
            return ResponseEntity.ok(updatedSanPhamChiTiet);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/toggle-trang-thai")
    public ResponseEntity<?> toggleProductStatus(@PathVariable Integer id) {
        String message = sanPhamService.toggleProductStatus(id);
        if (message.startsWith("Trạng thái")) {
            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
        }
    }


}








