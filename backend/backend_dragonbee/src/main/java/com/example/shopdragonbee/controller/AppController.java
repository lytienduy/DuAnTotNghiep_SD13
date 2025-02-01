package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.KhachHangResponse;
import com.example.shopdragonbee.dto.PhieuGiamGiaRequest;
import com.example.shopdragonbee.dto.PhieuGiamGiaResponse;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.entity.PhieuGiamGiaKhachHang;
import com.example.shopdragonbee.repository.KhachHangRepository;
import com.example.shopdragonbee.repository.PhieuGiamGiaKhachHangRepository;
import com.example.shopdragonbee.repository.PhieuGiamGiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dragonbee")
@CrossOrigin(origins = "http://localhost:3000")
public class AppController {

    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    @Autowired
    private PhieuGiamGiaKhachHangRepository phieuGiamGiaKhachHangRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    //show All phiếu giảm giá
    @GetMapping("/phieu-giam-gia")
    public Page<PhieuGiamGiaResponse> getAllPhieuGiamGia(Pageable pageable) {
        return phieuGiamGiaRepository.getPhieuGiamGiaList(pageable);
    }

    //show khách hàng trong thêm mới phiếu giảm giá phần "cá nhân"
    @GetMapping("/khach-hang")
    public Page<KhachHangResponse> getAllKhachHang(Pageable pageable) {
        return khachHangRepository.getKhachHangList(pageable);
    }

    //add phiếu giảm giá
    @PostMapping("/phieu-giam-gia")
    public ResponseEntity<String> createPhieuGiamGia(@RequestBody PhieuGiamGiaRequest request) {
        // Tạo đối tượng phiếu giảm giá từ request
        LocalDateTime now = LocalDateTime.now();

        // Xác định trạng thái dựa trên thời gian hiện tại
        String trangThai;
        if (now.isBefore(request.getNgayBatDau())) {
            trangThai = "Chưa diễn ra";
        } else if (now.isAfter(request.getNgayKetThuc())) {
            trangThai = "Đã kết thúc";
        } else {
            trangThai = "Đang diễn ra";
        }

        // Xây dựng đối tượng phiếu giảm giá
        PhieuGiamGia phieuGiamGia = PhieuGiamGia.builder()
                .ma(request.getMa())
                .tenPhieuGiamGia(request.getTenPhieuGiamGia())
                .loaiPhieuGiamGia(request.getLoaiPhieuGiamGia())
                .kieuGiamGia(request.getKieuGiamGia())
                .giaTriGiam(request.getGiaTriGiam())
                .soTienToiThieu(request.getSoTienToiThieu())
                .soTienGiamToiDa(request.getSoTienGiamToiDa())
                .ngayBatDau(request.getNgayBatDau())
                .ngayKetThuc(request.getNgayKetThuc())
                .soLuong(request.getSoLuong())
                .moTa(request.getMoTa())
                .trangThai(trangThai)  // Đặt trạng thái đã xác định
                .ngayTao(now)
                .nguoiTao("admin")  // Giá trị ví dụ, có thể lấy từ session
                .build();

        // Lưu phiếu giảm giá vào cơ sở dữ liệu
        phieuGiamGiaRepository.save(phieuGiamGia);

        // Nếu kiểu là "Cá nhân", thêm vào bảng `phieu_giam_gia_khach_hang`
        if ("Cá nhân".equalsIgnoreCase(request.getKieuGiamGia())) {
            List<PhieuGiamGiaKhachHang> khachHangRecords = request.getKhachHangIds().stream()
                    .map(idKhachHang -> PhieuGiamGiaKhachHang.builder()
                            .khachHang(khachHangRepository.findById(idKhachHang).orElseThrow(() ->
                                    new IllegalArgumentException("Không tìm thấy khách hàng với ID: " + idKhachHang)))
                            .phieuGiamGia(phieuGiamGia)
                            .trangThai("Đang sử dụng")
                            .ngayTao(now)
                            .nguoiTao("admin")
                            .build())
                    .collect(Collectors.toList());

            // Lưu danh sách vào bảng `phieu_giam_gia_khach_hang`
            phieuGiamGiaKhachHangRepository.saveAll(khachHangRecords);
        }

        return ResponseEntity.ok("Thêm mới phiếu giảm giá thành công!");
    }

}
