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
import java.util.Map;
import java.util.Optional;

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

            // Lấy mã sản phẩm lớn nhất từ database và tạo mã mới
            String lastMaSanPham = sanPhamRepository.findLastMaSanPham(); // Lấy mã lớn nhất hiện có
            String newMaSanPham = generateNewMaSanPham(lastMaSanPham);

            // Kiểm tra nếu không có danh sách sản phẩm chi tiết
            if (sanPhamRequest.getSanPhamChiTietList() == null || sanPhamRequest.getSanPhamChiTietList().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Danh sách sản phẩm chi tiết không được để trống!");
            }

            // Tạo sản phẩm chính (SanPham)
            SanPham sanPham = SanPham.builder()
                    .ma(newMaSanPham)
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

                MauSac mauSac = mauSacRepository.findById(chiTiet.getMauSac().getId()).orElse(null);
                Size size = sizeRepository.findById(chiTiet.getSize().getId()).orElse(null);

                if (mauSac == null || size == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Màu sắc hoặc kích cỡ không hợp lệ!");
                }

                SanPhamChiTiet sanPhamChiTiet = SanPhamChiTiet.builder()
                        .ma(newMaSanPham + "-" + mauSac.getId() + "-" + size.getId()) // Tạo mã chi tiết sản phẩm
                        .soLuong(chiTiet.getSoLuong())
                        .gia(chiTiet.getGia())
                        .moTa(chiTiet.getMoTa())
                        .trangThai(chiTiet.getTrangThai())
                        .sanPham(sanPham)
                        .mauSac(mauSac)
                        .size(size)
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

    // Hàm tạo mã sản phẩm mới theo định dạng SP001, SP002, ...
    private String generateNewMaSanPham(String lastMa) {
        if (lastMa == null || lastMa.isEmpty()) {
            return "SP001";
        }

        String numericPart = lastMa.replaceAll("\\D+", ""); // Lấy phần số từ mã cuối cùng
        int newNumber = Integer.parseInt(numericPart) + 1;
        return String.format("SP%03d", newNumber); // Định dạng thành SPXXX
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
// Ai swtich
@PutMapping("/{id}/toggle-trang-thai")
public ResponseEntity<?> toggleProductStatus(@PathVariable Integer id) {
    System.out.println("Gọi API chuyển trạng thái cho sản phẩm ID: " + id);

    Optional<SanPham> optionalSanPham = sanPhamRepository.findById(id);
    if (optionalSanPham.isPresent()) {
        SanPham sanPham = optionalSanPham.get();
        String oldStatus = sanPham.getTrangThai();
        String newStatus = oldStatus.equals("Còn hàng") ? "Hết hàng" : "Còn hàng";

        sanPham.setTrangThai(newStatus);
        sanPhamRepository.save(sanPham);

        System.out.println("Trạng thái đã chuyển từ " + oldStatus + " -> " + newStatus);
        return ResponseEntity.ok("Trạng thái đã được cập nhật.");
    }

    System.out.println("Không tìm thấy sản phẩm với ID: " + id);
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy sản phẩm.");
}








}