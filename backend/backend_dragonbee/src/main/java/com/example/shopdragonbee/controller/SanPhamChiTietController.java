package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.SanPhamChiTietDTO;
import com.example.shopdragonbee.dto.SanPhamChiTietUpdateDTO;
import com.example.shopdragonbee.dto.UpdateSanphamChiTietDTO;
import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.AnhSanPhamRepository;
import com.example.shopdragonbee.repository.SanPhamChiTietRepository;
import com.example.shopdragonbee.service.SanPhamChiTietService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;


    @GetMapping("/{id}")
    public ResponseEntity<SanPhamChiTietDTO> getSanPhamChiTiet(@PathVariable Integer id) {
        SanPhamChiTietDTO sanPhamChiTietDTO = sanPhamChiTietService.getSanPhamChiTietById(id);
        return ResponseEntity.ok(sanPhamChiTietDTO);
    }


    // update 1 sản phẩm chi tiết
    @PutMapping("/update/{id}")
    public ResponseEntity<SanPhamChiTiet> updateSanPhamChiTiet(@PathVariable Integer id, @RequestBody SanPhamChiTietUpdateDTO sanPhamChiTietUpdateDTO) {
        SanPhamChiTiet updatedSanPhamChiTiet = sanPhamChiTietService.updateSanPhamChiTiet(id, sanPhamChiTietUpdateDTO);
        return ResponseEntity.ok(updatedSanPhamChiTiet);
    }


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
                newSanPhamChiTiet.setTrangThai(dto.getTrangThai() != null ? dto.getTrangThai() : "Hoạt động");
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
    //tìm kiếm
    @GetMapping("/search")
    public ResponseEntity<List<SanPhamChiTiet>> searchSanPhamChiTiet(@RequestParam("ten") String ten) {
        List<SanPhamChiTiet> sanPhamChiTietList = sanPhamChiTietService.searchSanPhamChiTietByTen(ten);
        return ResponseEntity.ok(sanPhamChiTietList);
    }
    /// update số lượng và giá
    @PutMapping("/batch")
    public ResponseEntity<List<SanPhamChiTiet>> updateSanPhamChiTietBatch(
            @RequestBody List<UpdateSanphamChiTietDTO> updateDTOList) {

        List<SanPhamChiTiet> updatedSanPhamChiTiet = sanPhamChiTietService.updateSanPhamChiTietBatch(updateDTOList);

        if (updatedSanPhamChiTiet.isEmpty()) {
            // Trả về thông báo rõ ràng nếu không có sản phẩm nào được cập nhật
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // 204: Không có nội dung
        }

        return new ResponseEntity<>(updatedSanPhamChiTiet, HttpStatus.OK);
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<Page<SanPhamChiTiet>> searchSanPhamChiTiet(
            @RequestParam(required = false) String tenSanPham,
            @RequestParam(required = false) String tenDanhMuc,
            @RequestParam(required = false) String tenThuongHieu,
            @RequestParam(required = false) String tenPhongCach,
            @RequestParam(required = false) String tenChatLieu,
            @RequestParam(required = false) String tenKieuDang,
            @RequestParam(required = false) String tenKieuDaiQuan,
            @RequestParam(required = false) String tenMauSac,
            @RequestParam(required = false) String tenSize,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamChiTiet> result = sanPhamChiTietService.searchSanPhamChiTiet(
                tenSanPham, tenDanhMuc, tenThuongHieu, tenPhongCach, tenChatLieu,
                tenKieuDang, tenKieuDaiQuan, tenMauSac, tenSize, minPrice, maxPrice, pageable);

        return ResponseEntity.ok(result);
    }


    // API chuyển đổi trạng thái giữa "Hoạt động" và "Ngừng hoạt động"
    @PatchMapping("/{id}/trang-thai")
    public ResponseEntity<Map<String, Object>> updateTrangThai(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();

        // Tìm sản phẩm chi tiết theo ID
        SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm chi tiết không tồn tại"));

        // Kiểm tra trạng thái hiện tại và chuyển đổi trạng thái
        String currentStatus = sanPhamChiTiet.getTrangThai();

        switch (currentStatus) {
            case "Hoạt động":
                // Nếu hiện tại là "Hoạt động", chuyển sang "Ngừng hoạt động" hoặc "Ngừng bán"
                sanPhamChiTiet.setTrangThai("Ngừng hoạt động"); // Ví dụ, bạn có thể điều chỉnh theo nhu cầu
                break;
            case "Ngừng hoạt động":
                // Nếu hiện tại là "Ngừng hoạt động", chuyển sang "Hoạt động" hoặc "Ngừng bán"
                sanPhamChiTiet.setTrangThai("Hoạt động"); // Ví dụ, bạn có thể điều chỉnh theo nhu cầu
                break;
            case "Ngừng bán":
                // Nếu hiện tại là "Ngừng bán", chuyển sang "Hoạt động" hoặc "Ngừng hoạt động"
                sanPhamChiTiet.setTrangThai("Ngừng hoạt động"); // Ví dụ, bạn có thể điều chỉnh theo nhu cầu
                break;
            default:
                response.put("success", false);
                response.put("message", "Trạng thái không hợp lệ để thay đổi");
                return ResponseEntity.badRequest().body(response);
        }

        // Cập nhật trạng thái sản phẩm chi tiết
        sanPhamChiTietRepository.save(sanPhamChiTiet);

        response.put("success", true);
        response.put("message", "Trạng thái sản phẩm chi tiết đã được cập nhật");
        response.put("newStatus", sanPhamChiTiet.getTrangThai());

        return ResponseEntity.ok(response);
    }

}