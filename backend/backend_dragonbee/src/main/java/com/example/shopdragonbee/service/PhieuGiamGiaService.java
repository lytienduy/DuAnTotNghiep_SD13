package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.PhieuGiamGiaDTO;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.entity.PhieuGiamGiaKhachHang;
import com.example.shopdragonbee.repository.PhieuGiamGiaRepository;
import com.example.shopdragonbee.repository.PhieuGiamGiaKhachHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhieuGiamGiaService {

    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    @Autowired
    private PhieuGiamGiaKhachHangRepository phieuGiamGiaKhachHangRepository;

    @Autowired
    private EmailPGGService emailPGGService;

    public ResponseEntity<?> updateDiscountStatus(String ma) {
        Optional<PhieuGiamGia> optionalPhieuGiamGia = phieuGiamGiaRepository.findByMa(ma);

        if (optionalPhieuGiamGia.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy phiếu giảm giá");
        }

        PhieuGiamGia phieuGiamGia = optionalPhieuGiamGia.get();
        LocalDateTime now = LocalDateTime.now();

        // Kiểm tra nếu phiếu đã hết hạn
        if (phieuGiamGia.getNgayKetThuc().isBefore(now)) {
            return ResponseEntity.badRequest().body("Phiếu giảm giá đã hết hạn, không thể thay đổi trạng thái.");
        }

        // Kiểm tra trạng thái thủ công và thay đổi
        if (phieuGiamGia.getTrangThaiTuyChinh() == null || !phieuGiamGia.getTrangThaiTuyChinh()) {
            // Nếu là null hoặc false, set thành true (đã cập nhật thủ công)
            phieuGiamGia.setTrangThaiTuyChinh(true);
        } else {
            // Nếu đã là true, chuyển về false (cho phép cập nhật tự động)
            phieuGiamGia.setTrangThaiTuyChinh(false);
        }

        String oldStatus = phieuGiamGia.getTrangThai();
        // Chuyển đổi trạng thái
        if ("Đang diễn ra".equals(phieuGiamGia.getTrangThai())) {
            phieuGiamGia.setTrangThai("Đã kết thúc");
        } else if ("Chưa diễn ra".equals(phieuGiamGia.getTrangThai())) {
            phieuGiamGia.setTrangThai("Đã kết thúc");
        } else if ("Đã kết thúc".equals(phieuGiamGia.getTrangThai())) {
            // Nếu phiếu còn hiệu lực, có thể chuyển lại
            if (now.isBefore(phieuGiamGia.getNgayBatDau())) {
                phieuGiamGia.setTrangThai("Chưa diễn ra");
            } else {
                phieuGiamGia.setTrangThai("Đang diễn ra");
            }
        } else {
            return ResponseEntity.badRequest().body("Không thể thay đổi trạng thái của phiếu giảm giá này.");
        }

        // Cập nhật lại ngày sửa
        phieuGiamGia.setNgaySua(now);

        // Cập nhật trạng thái của phiếu giảm giá
        phieuGiamGiaRepository.save(phieuGiamGia);

        // Cập nhật trạng thái trong bảng khách hàng nếu kiểu là "Cá nhân"
        if ("Cá nhân".equalsIgnoreCase(phieuGiamGia.getKieuGiamGia())) {
            List<PhieuGiamGiaKhachHang> phieuGiamGiaKhachHangList = phieuGiamGiaKhachHangRepository.findByPhieuGiamGia(phieuGiamGia);

            // Gửi email thông báo nếu trạng thái có thay đổi từ "Đang diễn ra" hoặc "Chưa diễn ra" sang "Hết hạn"
            if (("Đang diễn ra".equals(oldStatus) || "Chưa diễn ra".equals(oldStatus)) && "Đã kết thúc".equals(phieuGiamGia.getTrangThai())) {
                List<String> emailsToSuspend = phieuGiamGiaKhachHangList.stream()
                        .map(phieuGiamGiaKhachHang -> phieuGiamGiaKhachHang.getKhachHang().getEmail())
                        .collect(Collectors.toList());
                emailPGGService.sendDiscountSuspendedNotification(emailsToSuspend, phieuGiamGia);
            }

            // Gửi email thông báo nếu trạng thái có thay đổi từ "Đã kết thúc" sang "Đang diễn ra"
            if ("Đã kết thúc".equals(oldStatus) && "Đang diễn ra".equals(phieuGiamGia.getTrangThai())) {
                List<String> emailsToActivate = phieuGiamGiaKhachHangList.stream()
                        .map(phieuGiamGiaKhachHang -> phieuGiamGiaKhachHang.getKhachHang().getEmail())
                        .collect(Collectors.toList());
                emailPGGService.sendDiscountResumedNotification(emailsToActivate, phieuGiamGia);
            }

            // Gửi email thông báo nếu trạng thái chuyển từ "Đã kết thúc" sang "Chưa diễn ra"
            if ("Đã kết thúc".equals(oldStatus) && "Chưa diễn ra".equals(phieuGiamGia.getTrangThai())) {
                List<String> emailsToNotify = phieuGiamGiaKhachHangList.stream()
                        .map(phieuGiamGiaKhachHang -> phieuGiamGiaKhachHang.getKhachHang().getEmail())
                        .collect(Collectors.toList());
                emailPGGService.sendDiscountResumedNotification(emailsToNotify, phieuGiamGia);  // Cùng hàm thông báo như khi phiếu trở lại "Đang diễn ra"
            }

            // Cập nhật trạng thái khách hàng
            for (PhieuGiamGiaKhachHang phieuGiamGiaKhachHang : phieuGiamGiaKhachHangList) {
                if ("Đã kết thúc".equals(phieuGiamGia.getTrangThai())) {
                    phieuGiamGiaKhachHang.setTrangThai("Hết hạn");
                } else if ("Đang diễn ra".equals(phieuGiamGia.getTrangThai())) {
                    phieuGiamGiaKhachHang.setTrangThai("Còn hạn");
                } else if ("Chưa diễn ra".equals(phieuGiamGia.getTrangThai())) {
                    phieuGiamGiaKhachHang.setTrangThai("Chưa tới ngày");
                }

                phieuGiamGiaKhachHang.setNgaySua(now);
                phieuGiamGiaKhachHangRepository.save(phieuGiamGiaKhachHang);
            }
        }

        return ResponseEntity.ok(phieuGiamGia.getTrangThai());
    }



    // Cập nhật trạng thái phiếu giảm giá mỗi 1 giờ
    @Scheduled(fixedRate = 3600000)  // 3600000 ms = 1 giờ
    public void updateTrangThaiPhieuGiamGia() {
        Iterable<PhieuGiamGia> danhSachPhieu = phieuGiamGiaRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (PhieuGiamGia phieu : danhSachPhieu) {
            // Nếu phiếu đã được chỉnh tay (trang_thai_tuy_chinh = true), bỏ qua cập nhật tự động
            if (phieu.getTrangThaiTuyChinh() != null && phieu.getTrangThaiTuyChinh()) {
                continue; // Bỏ qua phiếu giảm giá này nếu đã chỉnh tay
            }

            // Cập nhật trạng thái tự động
            if (now.isBefore(phieu.getNgayBatDau())) {
                phieu.setTrangThai("Chưa diễn ra");
            } else if (now.isAfter(phieu.getNgayKetThuc())) {
                phieu.setTrangThai("Đã kết thúc");
            } else {
                phieu.setTrangThai("Đang diễn ra");
            }

            phieuGiamGiaRepository.save(phieu);
        }
    }

    public List<PhieuGiamGia> timKiemPhieuGiamGia(String keyword, Integer idKhachHang) {
        List<PhieuGiamGia> phieuGiamGias = phieuGiamGiaRepository.findAll();

        // Lọc theo trạng thái "Đang diễn ra"
        phieuGiamGias = phieuGiamGias.stream()
                .filter(phieu -> "Đang diễn ra".equals(phieu.getTrangThai()))
                .collect(Collectors.toList());

        // Lọc phiếu có số lượng > 0
        phieuGiamGias = phieuGiamGias.stream()
                .filter(phieu -> phieu.getSoLuong() > 0)
                .collect(Collectors.toList());

        // Nếu có khách hàng được chọn, chỉ lấy kiểu giảm giá "Cá nhân" và "Công khai"
        if (idKhachHang != null) {
            List<PhieuGiamGiaKhachHang> phieuGiamGiaKhachHangs = phieuGiamGiaKhachHangRepository.findByKhachHangId(idKhachHang);

            // Nếu khách hàng có phiếu giảm giá Cá nhân
            List<Integer> phieuIds = phieuGiamGiaKhachHangs.stream()
                    .map(pgkh -> pgkh.getPhieuGiamGia().getId())
                    .collect(Collectors.toList());

            // Lọc phiếu giảm giá "Cá nhân" mà khách hàng có và "Công khai"
            phieuGiamGias = phieuGiamGias.stream()
                    .filter(phieu -> phieuIds.contains(phieu.getId()) || "Công khai".equals(phieu.getKieuGiamGia()))
                    .collect(Collectors.toList());
        } else {
            // Nếu không có khách hàng, chỉ lấy "Công khai"
            phieuGiamGias = phieuGiamGias.stream()
                    .filter(phieu -> "Công khai".equals(phieu.getKieuGiamGia()))
                    .collect(Collectors.toList());
        }

        // Lọc theo mã hoặc tên phiếu giảm giá
        if (keyword != null && !keyword.isEmpty()) {
            phieuGiamGias = phieuGiamGias.stream()
                    .filter(phieu -> phieu.getMa().contains(keyword) || phieu.getTenPhieuGiamGia().contains(keyword))
                    .collect(Collectors.toList());
        }

        return phieuGiamGias;
    }

    // Hàm kiểm tra số lượng phiếu giảm giá còn lại
    public PhieuGiamGiaDTO checkVoucherAvailability(String voucherCode) {
        Optional<PhieuGiamGia> optionalPhieuGiamGia = phieuGiamGiaRepository.findByMa(voucherCode);

        // Kiểm tra xem voucher có tồn tại không
        if (optionalPhieuGiamGia.isPresent()) {
            PhieuGiamGia phieuGiamGia = optionalPhieuGiamGia.get();

            // Kiểm tra số lượng voucher còn lại
            if (phieuGiamGia.getSoLuong() > 0) {
                return new PhieuGiamGiaDTO(phieuGiamGia); // Trả về thông tin voucher nếu còn
            }
        }

        // Nếu không có phiếu giảm giá hoặc hết số lượng, trả về null
        return null;
    }

    public double tinhTienGiam(PhieuGiamGia phieu, double tongTienSanPham) {
        if (tongTienSanPham < phieu.getSoTienToiThieu()) {
            return 0;
        }

        if ("Cố định".equals(phieu.getLoaiPhieuGiamGia())) {
            return Math.round(phieu.getGiaTriGiam());
        } else if ("Phần trăm".equals(phieu.getLoaiPhieuGiamGia())) {
            double tienGiam = tongTienSanPham * (phieu.getGiaTriGiam() / 100);
            if (phieu.getSoTienGiamToiDa() != null && tienGiam > phieu.getSoTienGiamToiDa()) {
                tienGiam = phieu.getSoTienGiamToiDa();
            }
            return Math.round(tienGiam);
        }

        return 0;
    }

    public PhieuGiamGia getByMa(String ma) {
        return phieuGiamGiaRepository.findByMa(ma)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã phiếu giảm giá: " + ma));
    }

}
