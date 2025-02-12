package com.example.shopdragonbee.service;

import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.entity.PhieuGiamGiaKhachHang;
import com.example.shopdragonbee.repository.PhieuGiamGiaKhachHangRepository;
import com.example.shopdragonbee.repository.PhieuGiamGiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PhieuGiamGiaKhachHangService {

    @Autowired
    private PhieuGiamGiaKhachHangRepository phieuGiamGiaKhachHangRepository;

    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    // Phương thức tự động cập nhật trạng thái mỗi giờ
    @Scheduled(cron = "0 0 * * * ?")  // Thực hiện mỗi giờ vào phút 0
    public void updatePhieuGiamGiaKhachHangStatus() {
        // Lấy danh sách tất cả các phiếu giảm giá khách hàng
        List<PhieuGiamGiaKhachHang> phieuGiamGiaKhachHangs = phieuGiamGiaKhachHangRepository.findAll();

        // Lấy thời gian hiện tại
        LocalDateTime now = LocalDateTime.now();

        // Duyệt qua từng phiếu giảm giá khách hàng
        for (PhieuGiamGiaKhachHang phieuGiamGiaKhachHang : phieuGiamGiaKhachHangs) {
            PhieuGiamGia phieuGiamGia = phieuGiamGiaKhachHang.getPhieuGiamGia(); // Lấy phiếu giảm giá

            // Kiểm tra trạng thái của phiếu giảm giá dựa trên thời gian
            String trangThaiPhieuGiamGia = phieuGiamGia.getTrangThai();
            String newTrangThaiKhachHang = "";

            if (now.isBefore(phieuGiamGia.getNgayBatDau())) {
                newTrangThaiKhachHang = "Chưa diễn ra";
            } else if (now.isAfter(phieuGiamGia.getNgayKetThuc())) {
                newTrangThaiKhachHang = "Hết hạn";
            } else {
                newTrangThaiKhachHang = "Còn hạn";
            }

            // Nếu trạng thái phiếu giảm giá thay đổi, cập nhật trạng thái của phiếu giảm giá khách hàng
            if (!newTrangThaiKhachHang.equals(phieuGiamGiaKhachHang.getTrangThai())) {
                phieuGiamGiaKhachHang.setTrangThai(newTrangThaiKhachHang);
                phieuGiamGiaKhachHang.setNgaySua(now); // Cập nhật thời gian sửa
                phieuGiamGiaKhachHangRepository.save(phieuGiamGiaKhachHang); // Lưu thay đổi vào cơ sở dữ liệu
            }
        }
    }
}
