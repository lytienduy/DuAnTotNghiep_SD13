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
        return phieuGiamGiaRepository.getPhieuGiamGiaList1(pageable);
    }

    //show khách hàng trong thêm mới phiếu giảm giá phần "cá nhân"
    @GetMapping("/khach-hang")
    public Page<KhachHangResponse> getAllKhachHang(Pageable pageable) {
        return khachHangRepository.getKhachHangList(pageable);
    }

    //add phiếu giảm giá
    @PostMapping("/add-phieu-giam-gia")
    public ResponseEntity<String> createPhieuGiamGia(@RequestBody PhieuGiamGiaRequest request) {
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
                .trangThai(trangThai)
                .ngayTao(now)
                .nguoiTao("Admin")
                .build();

        // Lưu phiếu giảm giá vào cơ sở dữ liệu
        phieuGiamGiaRepository.save(phieuGiamGia);

        // Log thông tin về khách hàng và phiếu giảm giá
        System.out.println("Khách hàng IDs: " + request.getKhachHangIds());

        // Nếu kiểu là "Cá nhân", thêm vào bảng `phieu_giam_gia_khach_hang`
        if ("Cá nhân".equalsIgnoreCase(request.getKieuGiamGia())) {
            List<PhieuGiamGiaKhachHang> khachHangRecords = request.getKhachHangIds().stream()
                    .map(idKhachHang -> PhieuGiamGiaKhachHang.builder()
                            .khachHang(khachHangRepository.findById(idKhachHang).orElseThrow(() ->
                                    new IllegalArgumentException("Không tìm thấy khách hàng với ID: " + idKhachHang)))
                            .phieuGiamGia(phieuGiamGia)
                            .trangThai("Đang sử dụng")
                            .ngayTao(now)
                            .nguoiTao("Admin")
                            .build())
                    .collect(Collectors.toList());

            // Lưu danh sách vào bảng `phieu_giam_gia_khach_hang`
            phieuGiamGiaKhachHangRepository.saveAll(khachHangRecords);
        }
        return ResponseEntity.ok("Thêm mới phiếu giảm giá thành công!");
    }

    // API lấy chi tiết phiếu giảm giá theo mã
    @GetMapping("/detail-phieu-giam-gia/{ma}")
    public ResponseEntity<PhieuGiamGiaResponse> getPhieuGiamGiaByMa(@PathVariable String ma) {
        // Tìm phiếu giảm giá theo mã
        PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository.findByMa(ma)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu giảm giá với mã: " + ma));

        // Kiểm tra giá trị null của soTienGiamToiDa và thay thế nếu cần
        Double giaTriGiamToiDa = phieuGiamGia.getSoTienGiamToiDa() != null ? phieuGiamGia.getSoTienGiamToiDa() : 0.0;

        // Chuyển đổi entity sang DTO
        PhieuGiamGiaResponse response = new PhieuGiamGiaResponse(
                phieuGiamGia.getMa(),
                phieuGiamGia.getTenPhieuGiamGia(),
                phieuGiamGia.getKieuGiamGia(),
                phieuGiamGia.getLoaiPhieuGiamGia(),
                phieuGiamGia.getGiaTriGiam(),
                phieuGiamGia.getSoLuong(),
                phieuGiamGia.getNgayBatDau(),
                phieuGiamGia.getNgayKetThuc(),
                phieuGiamGia.getTrangThai(),
                giaTriGiamToiDa,
                phieuGiamGia.getSoTienToiThieu()
        );

        // Nếu kiểu giảm giá là "Cá nhân", lấy danh sách khách hàng liên quan
        if ("Cá nhân".equalsIgnoreCase(phieuGiamGia.getKieuGiamGia())) {
            List<Integer> khachHangIds = phieuGiamGiaKhachHangRepository.findByPhieuGiamGiaId(phieuGiamGia.getId())
                    .stream()
                    .map(kh -> kh.getKhachHang().getId())
                    .collect(Collectors.toList());

            response.setKhachHangIds(khachHangIds);
        }

        return ResponseEntity.ok(response);
    }

}
