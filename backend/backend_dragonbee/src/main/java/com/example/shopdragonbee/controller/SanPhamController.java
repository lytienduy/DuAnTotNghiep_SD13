package com.example.shopdragonbee.controller;


import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.entity.MauSac;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.entity.Size;
import com.example.shopdragonbee.entity.ThuongHieu;
import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.repository.DanhMucRepository;
import com.example.shopdragonbee.repository.MauSacRepository;
import com.example.shopdragonbee.repository.SizeRepository;
import com.example.shopdragonbee.repository.ThuongHieuRepository;
import com.example.shopdragonbee.respone.SanPhamChiTietRespone;
import com.example.shopdragonbee.respone.SanPhamRespone;
import com.example.shopdragonbee.repository.SanPhamChiTietRepository;
import com.example.shopdragonbee.repository.SanPhamRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/sanpham")

public class SanPhamController {

    private final SanPhamRepository sanPhamRepository;
    private final SanPhamChiTietRepository sanPhamChiTietRepository;
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

    @Autowired
    public SanPhamController(SanPhamRepository sanPhamRepository, SanPhamChiTietRepository sanPhamChiTietRepository) {
        this.sanPhamRepository = sanPhamRepository;
        this.sanPhamChiTietRepository = sanPhamChiTietRepository;
    }

    @GetMapping
    public ResponseEntity<List<SanPhamRespone>> getAllSanPham() {
        List<SanPhamRespone> sanPhams = sanPhamRepository.getAll();
        return ResponseEntity.ok(sanPhams);
    }

    // API lấy danh sách sản phẩm có phân trang
    @GetMapping("/paged")
    public ResponseEntity<Page<SanPhamRespone>> getAllSanPhamPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamRespone> sanPhams = sanPhamRepository.getAllPaged(pageable);
        return ResponseEntity.ok(sanPhams);
    }

    // API lấy chi tiết sản phẩm
    @GetMapping("/{id}/chi-tiet")
    public ResponseEntity<?> getSanPhamChiTietBySanPhamId(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        if (page != null && size != null) {
            Pageable pageable = PageRequest.of(page, size);
            Page<SanPhamChiTietRespone> chiTietPage = sanPhamChiTietRepository.getChiTietPaged(pageable);
            return ResponseEntity.ok(chiTietPage);
        } else {
            List<SanPhamChiTietRespone> chiTietList = sanPhamChiTietRepository.findBySanPhamId(id);
            return ResponseEntity.ok(chiTietList);
        }
    }


    // AI add sản phẩm
    @Transactional
    @PostMapping("/add")
    public ResponseEntity<?> addSanPham(@Valid @RequestBody SanPham sanPhamRequest) {
        try {
            System.out.println("Dữ liệu nhận từ frontend: " + sanPhamRequest);

            // Kiểm tra nếu không có danh sách sản phẩm chi tiết
            if (sanPhamRequest.getSanPhamChiTietList() == null || sanPhamRequest.getSanPhamChiTietList().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Danh sách sản phẩm chi tiết không được để trống!");
            }

            // Tạo sản phẩm chính (SanPham)
            SanPham sanPham = SanPham.builder()
                    .ma(sanPhamRequest.getMa())
                    .tenSanPham(sanPhamRequest.getTenSanPham())
                    .moTa(sanPhamRequest.getMoTa())
                    .trangThai(sanPhamRequest.getTrangThai())
                    .ngayTao(LocalDateTime.now())
                    .nguoiTao(sanPhamRequest.getNguoiTao())
                    .build();

            sanPham = sanPhamRepository.save(sanPham); // Lưu sản phẩm chính

            // Thêm danh sách sản phẩm chi tiết
            List<SanPhamChiTiet> chiTietList = new ArrayList<>();
            for (SanPhamChiTiet chiTiet : sanPhamRequest.getSanPhamChiTietList()) {
                if (chiTiet.getMauSac() == null || chiTiet.getSize() == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Màu sắc và kích cỡ không được để trống!");
                }

                SanPhamChiTiet sanPhamChiTiet = SanPhamChiTiet.builder()
                        .ma(chiTiet.getMa())
                        .soLuong(chiTiet.getSoLuong())
                        .gia(chiTiet.getGia())
                        .moTa(chiTiet.getMoTa())
                        .trangThai(chiTiet.getTrangThai())
                        .sanPham(sanPham)
                        .mauSac(mauSacRepository.findById(chiTiet.getMauSac().getId()).orElse(null))
                        .size(sizeRepository.findById(chiTiet.getSize().getId()).orElse(null))
                        .ngayTao(LocalDateTime.now())
                        .nguoiTao(chiTiet.getNguoiTao())
                        .build();

                chiTietList.add(sanPhamChiTiet);
            }

            sanPhamChiTietRepository.saveAll(chiTietList); // Lưu danh sách sản phẩm chi tiết

            return ResponseEntity.ok("Thêm sản phẩm thành công!");
        } catch (Exception e) {
            System.err.println("Lỗi khi thêm sản phẩm: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi thêm sản phẩm: " + e.getMessage());
        }
    }


    // AI sửa sản phẩm
    @Transactional
    @PutMapping("/chi-tiet/update-multiple")
    public ResponseEntity<?> updateMultipleSanPhamChiTiet(@RequestBody List<SanPhamChiTiet> sanPhamChiTietList) {
        try {
            // Tạo danh sách để lưu các sản phẩm chi tiết đã cập nhật
            List<SanPhamChiTiet> updatedSanPhamChiTietList = new ArrayList<>();

            // Duyệt qua từng sản phẩm chi tiết trong danh sách
            for (SanPhamChiTiet sanPhamChiTiet : sanPhamChiTietList) {
                // Lấy sản phẩm chi tiết hiện tại từ DB
                SanPhamChiTiet existingSanPhamChiTiet = sanPhamChiTietRepository.findById(sanPhamChiTiet.getId()).orElseThrow(() -> new RuntimeException("Sản phẩm chi tiết không tồn tại"));

                // Cập nhật các trường thông tin
                existingSanPhamChiTiet.setMa(sanPhamChiTiet.getMa());
                existingSanPhamChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong());
                existingSanPhamChiTiet.setMoTa(sanPhamChiTiet.getMoTa());
                existingSanPhamChiTiet.setTrangThai(sanPhamChiTiet.getTrangThai());
                existingSanPhamChiTiet.setGia(sanPhamChiTiet.getGia());
                existingSanPhamChiTiet.setMauSac(mauSacRepository.findById(sanPhamChiTiet.getMauSac().getId()).orElse(null));
                existingSanPhamChiTiet.setChatLieu(chatLieuRepository.findById(sanPhamChiTiet.getChatLieu().getId()).orElse(null));
                existingSanPhamChiTiet.setDanhMuc(danhMucRepository.findById(sanPhamChiTiet.getDanhMuc().getId()).orElse(null));
                existingSanPhamChiTiet.setSize(sizeRepository.findById(sanPhamChiTiet.getSize().getId()).orElse(null));
                existingSanPhamChiTiet.setThuongHieu(thuongHieuRepository.findById(sanPhamChiTiet.getThuongHieu().getId()).orElse(null));
                existingSanPhamChiTiet.setKieuDang(sanPhamChiTiet.getKieuDang());
                existingSanPhamChiTiet.setKieuDaiQuan(sanPhamChiTiet.getKieuDaiQuan());
                existingSanPhamChiTiet.setXuatXu(sanPhamChiTiet.getXuatXu());
                existingSanPhamChiTiet.setPhongCach(sanPhamChiTiet.getPhongCach());
                existingSanPhamChiTiet.setNguoiSua(sanPhamChiTiet.getNguoiSua());
                existingSanPhamChiTiet.setNgaySua(LocalDateTime.now());

                // Lưu lại sản phẩm chi tiết đã cập nhật
                updatedSanPhamChiTietList.add(sanPhamChiTietRepository.save(existingSanPhamChiTiet));
            }

            // Trả về danh sách các sản phẩm chi tiết đã sửa
            return ResponseEntity.ok(updatedSanPhamChiTietList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật: " + e.getMessage());
        }
    }

    // tìm kiếm và bộ lọc
    @GetMapping("/search")
    public ResponseEntity<Page<SanPhamRespone>> searchSanPham(
            @RequestParam(required = false) String tenSanPham,
            @RequestParam(required = false) String trangThai,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamRespone> result = sanPhamRepository.searchSanPham(tenSanPham, trangThai, pageable);

        return ResponseEntity.ok(result);
    }






}