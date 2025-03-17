package com.example.shopdragonbee.controller;


import com.example.shopdragonbee.dto.SanPhamDTO;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.respone.SanPhamChiTietRespone;
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



    // API lấy tất cả sản phẩm (không phân trang)
    @GetMapping("/all")
    public ResponseEntity<List<SanPhamDTO>> getAllSanPham() {
        List<SanPhamDTO> sanPhams = sanPhamService.getAllSanPham();
        return ResponseEntity.ok(sanPhams);
    }

    // API lấy tất cả sản phẩm có phân trang
    @GetMapping("/paged")
    public ResponseEntity<Page<SanPhamDTO>> getAllSanPhamPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamDTO> sanPhams = sanPhamService.getAllSanPhamPaged(pageable);
        return ResponseEntity.ok(sanPhams);
    }
    @GetMapping("/chi-tiet/all")
    public Page<SanPhamChiTietRespone> getAllSanPhamChiTiet(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return sanPhamService.getAllSanPhamChiTiet(page, size);
    }

    // API lấy sản phẩm chi tiết theo ID sản phẩm cha có phân trang
    @GetMapping("/by-san-pham/{id}")
    public Page<SanPhamChiTietRespone> getSanPhamChiTietBySanPhamId(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.out.println("sanPhamId: " + id);  // Log sanPhamId để kiểm tra
        return sanPhamService.getSanPhamChiTietBySanPhamId(id, page, size);
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
    public ResponseEntity<Page<SanPhamDTO>> searchSanPham(
            @RequestParam(required = false) String tenSanPham,
            @RequestParam(required = false) String trangThai,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamDTO> result = sanPhamService.searchSanPham(tenSanPham, trangThai, pageable);

        return ResponseEntity.ok(result);
    }

// chuyển đổi trạng thái
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








