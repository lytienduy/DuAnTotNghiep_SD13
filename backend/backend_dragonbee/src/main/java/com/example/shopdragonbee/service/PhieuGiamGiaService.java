package com.example.shopdragonbee.service;

import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.repository.PhieuGiamGiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class PhieuGiamGiaService {

    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    // Cập nhật trạng thái phiếu giảm giá mỗi 1 giờ
    @Scheduled(fixedRate = 3600000)  // 3600000 ms = 1 giờ
    public void updateTrangThaiPhieuGiamGia() {
        Iterable<PhieuGiamGia> iterablePhieu = phieuGiamGiaRepository.findAll();

        // Chuyển đổi từ Iterable sang List
        List<PhieuGiamGia> danhSachPhieu = StreamSupport
                .stream(iterablePhieu.spliterator(), false)
                .collect(Collectors.toList());

        for (PhieuGiamGia phieu : danhSachPhieu) {
            LocalDateTime now = LocalDateTime.now();

            if (now.isBefore(phieu.getNgayBatDau())) {
                phieu.setTrangThai("Chưa diễn ra");
            } else if (now.isAfter(phieu.getNgayKetThuc())) {
                phieu.setTrangThai("Đã kết thúc");
            } else {
                phieu.setTrangThai("Đang diễn ra");
            }

            // Cập nhật lại phiếu giảm giá trong cơ sở dữ liệu
            phieuGiamGiaRepository.save(phieu);
        }
    }
}
