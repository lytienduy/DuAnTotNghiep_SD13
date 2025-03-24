package com.example.shopdragonbee.repository;


import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.entity.HoaDonChiTiet;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Integer> {

    HoaDonChiTiet getHoaDonChiTietByHoaDonAndSanPhamChiTietAndDonGia(HoaDon hoaDon, SanPhamChiTiet sanPhamChiTiet, Double donGia);

//    @Query("SELECT hdct.sanPhamChiTiet.sanPham FROM HoaDonChiTiet hdct " +
//            "WHERE hdct.hoaDon.trangThai = 'Hoàn thành' " +
//            "AND hdct.sanPhamChiTiet.sanPham.trangThai = :trangThai " +
//            "AND (SELECT SUM(spct.soLuong) FROM SanPhamChiTiet spct WHERE spct.sanPham = hdct.sanPhamChiTiet.sanPham) > 0 " +
//            "GROUP BY hdct.sanPhamChiTiet.sanPham " +
//            "ORDER BY SUM(hdct.soLuong) DESC")
//    List<SanPham> findTopSanPhamChiTietBanChay(Pageable pageable,@Param("trangThai") String trangThai);

}
