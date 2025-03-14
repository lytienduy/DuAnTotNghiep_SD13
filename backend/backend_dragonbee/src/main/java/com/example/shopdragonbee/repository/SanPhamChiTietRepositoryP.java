package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamChiTietRepositoryP extends JpaRepository<SanPhamChiTiet, Integer>, JpaSpecificationExecutor<SanPhamChiTiet> {
    SanPhamChiTiet findByMa(String ma);

    //Tìm sản phẩm chi tiết của sản phẩm mới nhất
    SanPhamChiTiet findTopBySanPhamOrderByNgayTaoDesc(SanPham sanPham);

    @Query("SELECT DISTINCT sp FROM SanPham sp " +
            "JOIN SanPhamChiTiet spct ON spct.sanPham =  sp " +
            "WHERE LOWER(spct.danhMuc.tenDanhMuc) LIKE LOWER(:tenDanhMuc) " +
            "AND LOWER(sp.trangThai) = 'hoạt động'")
    List<SanPham> getListSanPhamTheoTenDanhMucVaDangHoatDong(@Param("tenDanhMuc") String tenDanhMuc);


}
