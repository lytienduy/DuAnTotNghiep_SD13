package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.GioHang;
import com.example.shopdragonbee.entity.GioHangChiTiet;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GioHangChiTietRepository extends JpaRepository<GioHangChiTiet,Integer> {
    GioHangChiTiet findBySanPhamChiTietAndGioHang(SanPhamChiTiet sanPhamChiTiet,GioHang gioHang);
}
