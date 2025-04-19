package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.GioHang;
import com.example.shopdragonbee.entity.GioHangChiTiet;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GioHangChiTietRepository extends JpaRepository<GioHangChiTiet,Integer> {
    GioHangChiTiet findBySanPhamChiTietAndGioHang(SanPhamChiTiet sanPhamChiTiet,GioHang gioHang);
    List<GioHangChiTiet> findByGioHangOrderByNgayTaoDesc(GioHang gioHang);

    //Dùng để lấy số lượng spct trong giỏ hàng theo khách hàng
    @Query("SELECT COALESCE(SUM(ghct.soLuong), 0) FROM GioHangChiTiet ghct WHERE ghct.gioHang = :gioHang and ghct.sanPhamChiTiet = :spct")
    Integer getTongSoLuongSPCTTrongGioHang(@Param("gioHang") GioHang gioHang, @Param("spct") SanPhamChiTiet sanPhamChiTiet);
}
