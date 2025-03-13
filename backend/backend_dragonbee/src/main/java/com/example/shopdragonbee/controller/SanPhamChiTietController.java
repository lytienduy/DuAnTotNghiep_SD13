package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.SanPhamChiTietDTO;
import com.example.shopdragonbee.dto.SanPhamChiTietUpdateDTO;
import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.AnhSanPhamRepository;
import com.example.shopdragonbee.service.SanPhamChiTietService;
import com.example.shopdragonbee.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/san-pham-chi-tiet")
public class SanPhamChiTietController {

    @Autowired
    private SanPhamChiTietService sanPhamChiTietService;
    @Autowired
    private SanPhamService sanPhamService;
    @Autowired
    private AnhSanPhamRepository anhSanPhamRepository;
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
//@GetMapping("/search")
//public ResponseEntity<List<SanPhamChiTietDTO>> searchSanPham(
//        @RequestParam(required = false) String tenSanPham,
//        @RequestParam(required = false) Integer danhMucId,
//        @RequestParam(required = false) Integer thuongHieuId,
//        @RequestParam(required = false) Integer phongCachId,
//        @RequestParam(required = false) Integer chatLieuId,
//        @RequestParam(required = false) Integer kieuDangId,
//        @RequestParam(required = false) Integer kieuDaiQuanId,
//        @RequestParam(required = false) Integer xuatXuId,
//        @RequestParam(required = false) Integer mauSacId,
//        @RequestParam(required = false) Integer sizeId,
//        @RequestParam(required = false) Double giaMin,
//        @RequestParam(required = false) Double giaMax) {
//
//    List<SanPhamChiTietDTO> result = sanPhamChiTietService.searchSanPham(tenSanPham, danhMucId, thuongHieuId, phongCachId, chatLieuId, kieuDangId, kieuDaiQuanId, xuatXuId, mauSacId, sizeId, giaMin, giaMax);
//    return ResponseEntity.ok(result);
//}

    //add
    // API thêm sản phẩm chi tiết và ảnh
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
                newSanPhamChiTiet.setMa(sanPhamChiTietService.generateProductCode());
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

                // Thêm sản phẩm chi tiết vào danh sách
                SanPhamChiTiet savedSanPhamChiTiet = sanPhamChiTietService.addSanPhamChiTiet(newSanPhamChiTiet);

                // Thêm ảnh cho sản phẩm chi tiết (nếu có)
                if (dto.getAnhUrls() != null && !dto.getAnhUrls().isEmpty()) {
                    List<AnhSanPham> anhSanPhams = new ArrayList<>();
                    for (String anhUrl : dto.getAnhUrls()) {
                        AnhSanPham anhSanPham = new AnhSanPham();
                        anhSanPham.setAnhUrl(anhUrl);
                        anhSanPham.setMa(sanPhamChiTietService.generateImageCode()); // Tạo mã cho ảnh
                        anhSanPham.setSanPhamChiTiet(savedSanPhamChiTiet); // Liên kết ảnh với sản phẩm chi tiết
                        anhSanPhams.add(anhSanPham);
                    }
                    anhSanPhamRepository.saveAll(anhSanPhams); // Lưu tất cả ảnh vào DB
                }

                savedProducts.add(savedSanPhamChiTiet);
            }

            return new ResponseEntity<>(savedProducts, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("❌ Lỗi khi thêm sản phẩm chi tiết: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
