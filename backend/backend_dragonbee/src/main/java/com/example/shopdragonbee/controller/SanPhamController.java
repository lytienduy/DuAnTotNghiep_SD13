package com.example.shopdragonbee.controller;


import com.example.shopdragonbee.dto.SanPhamChiTietDTO;
import com.example.shopdragonbee.dto.SanPhamDTO;
import com.example.shopdragonbee.entity.MauSac;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.entity.Size;
import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.repository.DanhMucRepository;
import com.example.shopdragonbee.repository.MauSacRepository;
import com.example.shopdragonbee.repository.SizeRepository;
import com.example.shopdragonbee.repository.ThuongHieuRepository;
import com.example.shopdragonbee.respone.SanPhamChiTietRespone;
import com.example.shopdragonbee.respone.SanPhamRespone;
import com.example.shopdragonbee.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
// add chi tiết
@PostMapping("/add/chi-tiet")
public ResponseEntity<?> addSanPhamChiTiet(@RequestBody List<SanPhamChiTietDTO> dtoList) {
    System.out.println("🚀 Dữ liệu nhận từ Frontend: " + dtoList);

    if (dtoList.isEmpty()) {
        return new ResponseEntity<>("❌ Danh sách sản phẩm chi tiết không được để trống.", HttpStatus.BAD_REQUEST);
    }

    try {
        List<SanPhamChiTiet> savedProducts = new ArrayList<>();

        for (SanPhamChiTietDTO dto : dtoList) {
            SanPham sanPham = sanPhamService.getSanPhamById(dto.getSanPhamId());
            SanPhamChiTiet newSanPhamChiTiet = new SanPhamChiTiet();
            newSanPhamChiTiet.setSanPham(sanPham);
            newSanPhamChiTiet.setSoLuong(dto.getSoLuong() != null ? dto.getSoLuong() : 0);
            newSanPhamChiTiet.setGia(dto.getGia() != null ? dto.getGia() : 0.0);
            newSanPhamChiTiet.setMoTa(dto.getMoTa() != null ? dto.getMoTa() : "Không có mô tả");
            newSanPhamChiTiet.setTrangThai(dto.getTrangThai() != null ? dto.getTrangThai() : "Còn hàng");
            newSanPhamChiTiet.setMa(sanPhamService.generateProductCode());
            newSanPhamChiTiet.setNgayTao(LocalDateTime.now());
            newSanPhamChiTiet.setNguoiTao("Admin");

            // Gán các thuộc tính khác nếu có ID
            if (dto.getDanhMucId() != null) {
                newSanPhamChiTiet.setDanhMuc(sanPhamService.getDanhMucById(dto.getDanhMucId()));
            }
            if (dto.getThuongHieuId() != null) {
                newSanPhamChiTiet.setThuongHieu(sanPhamService.getThuongHieuById(dto.getThuongHieuId()));
            }
            if (dto.getPhongCachId() != null) {
                newSanPhamChiTiet.setPhongCach(sanPhamService.getPhongCachById(dto.getPhongCachId()));
            }
            if (dto.getChatLieuId() != null) {
                newSanPhamChiTiet.setChatLieu(sanPhamService.getChatLieuById(dto.getChatLieuId()));
            }
            if (dto.getKieuDangId() != null) {
                newSanPhamChiTiet.setKieuDang(sanPhamService.getKieuDangById(dto.getKieuDangId()));
            }
            if (dto.getKieuDaiQuanId() != null) {
                newSanPhamChiTiet.setKieuDaiQuan(sanPhamService.getKieuDaiQuanById(dto.getKieuDaiQuanId()));
            }
            if (dto.getXuatXuId() != null) {
                newSanPhamChiTiet.setXuatXu(sanPhamService.getXuatXuById(dto.getXuatXuId()));
            }

            // Gán Màu Sắc và Size
            if (dto.getMauSacId() != null) {
                newSanPhamChiTiet.setMauSac(sanPhamService.getMauSacById(dto.getMauSacId()));
            }
            if (dto.getSizeId() != null) {
                newSanPhamChiTiet.setSize(sanPhamService.getSizeById(dto.getSizeId()));
            }

            // Lưu sản phẩm chi tiết vào danh sách
            savedProducts.add(sanPhamService.addSanPhamChiTiet(newSanPhamChiTiet));
        }

        return new ResponseEntity<>(savedProducts, HttpStatus.CREATED);
    } catch (Exception e) {
        return new ResponseEntity<>("❌ Lỗi khi thêm sản phẩm chi tiết: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}





}








