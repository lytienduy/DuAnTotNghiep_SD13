package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.KhachHangPGGResponse;
import com.example.shopdragonbee.dto.PhieuGiamGiaRequest;
import com.example.shopdragonbee.dto.PhieuGiamGiaResponse;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.entity.PhieuGiamGiaKhachHang;
import com.example.shopdragonbee.repository.KhachHangPGGRepository;
import com.example.shopdragonbee.repository.PhieuGiamGiaKhachHangRepository;
import com.example.shopdragonbee.repository.PhieuGiamGiaRepository;
import com.example.shopdragonbee.repository.PhieuGiamGiaSpecification;
import com.example.shopdragonbee.service.KhachHangPGGService;
import com.example.shopdragonbee.service.PhieuGiamGiaService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dragonbee")
@CrossOrigin(origins = "http://localhost:3000")
public class AppController {

    @Autowired
    private KhachHangPGGService khachHangPGGService;

    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    @Autowired
    private PhieuGiamGiaKhachHangRepository phieuGiamGiaKhachHangRepository;

    @Autowired
    private KhachHangPGGRepository khachHangPGGRepository;

    @Autowired
    private PhieuGiamGiaService phieuGiamGiaService;

    @GetMapping("/search-khach-hang")
    public Page<KhachHangPGGResponse> searchKhachHang(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return khachHangPGGService.searchKhachHang(keyword, pageable);
    }

    @GetMapping("/search-phieu-giam-gia")
    public Page<PhieuGiamGiaResponse> searchPhieuGiamGia(
            @RequestParam(value = "maOrTen", required = false) String maOrTen,
            @RequestParam(value = "tuNgay", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate tuNgay,
            @RequestParam(value = "denNgay", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate denNgay,
            @RequestParam(value = "kieuGiamGia", required = false) String kieuGiamGia,
            @RequestParam(value = "trangThai", required = false) String trangThai,
            Pageable pageable) {

        // Chuyển LocalDate thành LocalDateTime để tương thích với kiểu dữ liệu trong cơ sở dữ liệu
        LocalDateTime tuNgayTime = (tuNgay != null) ? tuNgay.atStartOfDay() : null;
        LocalDateTime denNgayTime = (denNgay != null) ? denNgay.atTime(23, 59, 59) : null;

        // Tạo Specification dựa trên các tham số tìm kiếm
        Specification<PhieuGiamGia> spec = PhieuGiamGiaSpecification.search(maOrTen, tuNgayTime, denNgayTime, kieuGiamGia, trangThai);

        // Tìm kiếm theo Specification
        return phieuGiamGiaRepository.findAll(spec, pageable).map(phieuGiamGia -> {
            // Kiểm tra nếu soTienGiamToiDa là null và gán giá trị mặc định là 0.0 nếu cần
            Double soTienGiamToiDa = phieuGiamGia.getSoTienGiamToiDa() != null ? phieuGiamGia.getSoTienGiamToiDa() : 0.0;

            return new PhieuGiamGiaResponse(
                    phieuGiamGia.getMa(),
                    phieuGiamGia.getTenPhieuGiamGia(),
                    phieuGiamGia.getKieuGiamGia(),
                    phieuGiamGia.getLoaiPhieuGiamGia(),
                    phieuGiamGia.getGiaTriGiam(),
                    phieuGiamGia.getSoLuong(),
                    phieuGiamGia.getNgayBatDau(),
                    phieuGiamGia.getNgayKetThuc(),
                    phieuGiamGia.getTrangThai(),
                    soTienGiamToiDa, // Trả về giá trị đã được kiểm tra null
                    phieuGiamGia.getSoTienToiThieu()
            );
        });
    }

    // API cập nhật trạng thái phiếu giảm giá bằng icon chuyển đổi
    @PutMapping("/change-status/{ma}")
    public ResponseEntity<?> changeDiscountStatus(@PathVariable String ma) {
        return phieuGiamGiaService.updateDiscountStatus(ma);
    }

    //show All phiếu giảm giá
    @GetMapping("/phieu-giam-gia")
    public Page<PhieuGiamGiaResponse> getAllPhieuGiamGia(Pageable pageable) {
        return phieuGiamGiaRepository.getPhieuGiamGiaList1(pageable);
    }

    //show khách hàng trong thêm mới phiếu giảm giá phần "cá nhân"
    @GetMapping("/khach-hang")
    public Page<KhachHangPGGResponse> getAllKhachHang(Pageable pageable) {
        return khachHangPGGRepository.getKhachHangList(pageable);
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
                            .khachHang(khachHangPGGRepository.findById(idKhachHang).orElseThrow(() ->
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

    //Cập nhật phiếu giảm giá
    @Transactional
    @PutMapping("/update-phieu-giam-gia/{ma}")
    public ResponseEntity<String> updatePhieuGiamGia(@PathVariable String ma, @RequestBody PhieuGiamGiaRequest request) {
        PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository.findByMa(ma)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu giảm giá với mã: " + ma));

        // Kiểm tra kiểu phiếu giảm giá hiện tại
        String currentKieuGiamGia = phieuGiamGia.getKieuGiamGia();

        // Cập nhật các trường của phiếu giảm giá
        phieuGiamGia.setTenPhieuGiamGia(request.getTenPhieuGiamGia());
        phieuGiamGia.setGiaTriGiam(request.getGiaTriGiam());
        phieuGiamGia.setLoaiPhieuGiamGia(request.getLoaiPhieuGiamGia());
        phieuGiamGia.setSoTienGiamToiDa(request.getSoTienGiamToiDa());
        phieuGiamGia.setSoLuong(request.getSoLuong());
        phieuGiamGia.setSoTienToiThieu(request.getSoTienToiThieu());
        phieuGiamGia.setNgayBatDau(request.getNgayBatDau());
        phieuGiamGia.setNgayKetThuc(request.getNgayKetThuc());
        phieuGiamGia.setKieuGiamGia(request.getKieuGiamGia());
        phieuGiamGia.setTrangThaiTuyChinh(false);

        // Cập nhật trạng thái phiếu giảm giá
        LocalDateTime now = LocalDateTime.now();
        String trangThai;
        if (now.isBefore(request.getNgayBatDau())) {
            trangThai = "Chưa diễn ra";
        } else if (now.isAfter(request.getNgayKetThuc())) {
            trangThai = "Đã kết thúc";
        } else {
            trangThai = "Đang diễn ra";
        }
        phieuGiamGia.setTrangThai(trangThai);

        // Lưu lại thay đổi
        phieuGiamGiaRepository.save(phieuGiamGia);

        // Nếu kiểu phiếu giảm giá chuyển từ "Cá nhân" sang "Công khai", cần xóa tất cả khách hàng
        if ("Cá nhân".equalsIgnoreCase(currentKieuGiamGia) && "Công khai".equalsIgnoreCase(request.getKieuGiamGia())) {
            phieuGiamGiaKhachHangRepository.deleteByPhieuGiamGiaId(phieuGiamGia.getId());
        }

// Nếu kiểu là "Cá nhân", cập nhật khách hàng liên quan
        if ("Cá nhân".equalsIgnoreCase(request.getKieuGiamGia())) {
            // Xoá các khách hàng cũ trước khi thêm mới
            phieuGiamGiaKhachHangRepository.deleteByPhieuGiamGiaId(phieuGiamGia.getId());

            // Thêm khách hàng mới
            List<PhieuGiamGiaKhachHang> khachHangRecords = request.getKhachHangIds().stream()
                    .map(idKhachHang -> PhieuGiamGiaKhachHang.builder()
                            .khachHang(khachHangPGGRepository.findById(idKhachHang).orElseThrow(() ->
                                    new IllegalArgumentException("Không tìm thấy khách hàng với ID: " + idKhachHang)))
                            .phieuGiamGia(phieuGiamGia)
                            .trangThai("Đang sử dụng")
                            .ngayTao(now)
                            .nguoiTao("Admin")
                            .build())
                    .collect(Collectors.toList());

            // Lưu danh sách vào bảng `phieu_giam_gia_khach_hang`
            phieuGiamGiaKhachHangRepository.saveAll(khachHangRecords);

            // ✅ Cập nhật số lượng phiếu giảm giá bằng số lượng khách hàng
            phieuGiamGia.setSoLuong(request.getKhachHangIds().size());
        }

// Lưu lại thay đổi
        phieuGiamGiaRepository.save(phieuGiamGia);

        return ResponseEntity.ok("Cập nhật phiếu giảm giá thành công!");
    }



}
