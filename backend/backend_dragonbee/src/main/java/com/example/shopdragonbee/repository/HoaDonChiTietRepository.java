package com.example.shopdragonbee.repository;


import com.example.shopdragonbee.entity.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Integer> {

    HoaDonChiTiet getHoaDonChiTietByHoaDonAndSanPhamChiTietAndDonGiaAndTrangThai(HoaDon hoaDon, SanPhamChiTiet sanPhamChiTiet, Double donGia, String trangThai);

    List<HoaDonChiTiet> getHoaDonChiTietByHoaDonAndTrangThaiOrderByNgayTaoDesc(HoaDon hoaDon, String trangThai);


    @Query("SELECT COALESCE(SUM(hdct.soLuong), 0) FROM HoaDonChiTiet hdct " +
            "WHERE hdct.hoaDon = :hoaDon " +
            "AND hdct.sanPhamChiTiet = :sanPhamChiTiet " +
            "AND hdct.trangThai = :trangThai")
    Integer getTongSoluongSanPhamTheoHoaDonVaSPCTVaTrangThai(
            @Param("hoaDon") HoaDon hoaDon,
            @Param("sanPhamChiTiet") SanPhamChiTiet sanPhamChiTiet,
            @Param("trangThai") String trangThai
    );

    //Hàm này để tính tổng số lượng sản phẩm theo khách hàng có hóa đơn chờ xác nhận
    @Query("SELECT COALESCE(SUM(hdct.soLuong), 0) FROM HoaDonChiTiet hdct " +
            "WHERE hdct.sanPhamChiTiet = :sanPhamChiTiet " +
            "AND hdct.trangThai = :trangThai AND hdct.hoaDon in (Select hd FROM HoaDon hd where hd.trangThai = :trangThaiHoaDon AND hd.khachHang = :khachHang)")
    Integer getSoLuongSanPhamTheoCacHoaDonChoXacNhanCuaKhachHang(
            @Param("sanPhamChiTiet") SanPhamChiTiet sanPhamChiTiet,
            @Param("trangThai") String trangThai,
            @Param("trangThaiHoaDon") String trangThaiHoaDon,
            @Param("khachHang") KhachHang khachHang
    );


}
