package com.example.shopdragonbee.service;

import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.SanPhamChiTietRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SanPhamChiTietService {

    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;

    public SanPhamChiTiet addSanPhamChiTiet(SanPhamChiTiet newSanPhamChiTiet) {
        // Tạo mã sản phẩm (ma)
        String newMa = generateProductCode();
        newSanPhamChiTiet.setMa(newMa);

        // Đặt trạng thái dựa trên số lượng
        if (newSanPhamChiTiet.getSoLuong() > 0) {
            newSanPhamChiTiet.setTrangThai("Còn hàng");
        } else {
            newSanPhamChiTiet.setTrangThai("Hết hàng");
        }

        newSanPhamChiTiet.setNgayTao(LocalDateTime.now());
        newSanPhamChiTiet.setNguoiTao("Admin"); // Hoặc đặt tự động theo người dùng hiện tại

        return sanPhamChiTietRepository.save(newSanPhamChiTiet);
    }

    private String generateProductCode() {
        Integer maxId = sanPhamChiTietRepository.getMaxId();  // Thực hiện phương thức này trong repository
        return "SPCT" + (maxId + 1);
    }
}
