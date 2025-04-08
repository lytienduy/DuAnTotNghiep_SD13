package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SanPhamChiTietRepositoryP extends JpaRepository<SanPhamChiTiet, Integer>, JpaSpecificationExecutor<SanPhamChiTiet> {
    SanPhamChiTiet findByMa(String ma);

    //Tìm sản phẩm chi tiết của sản phẩm mới nhất
    SanPhamChiTiet findTopBySanPhamOrderByNgayTaoDesc(SanPham sanPham);


    @Query(value = " SELECT DISTINCT sp.* FROM san_pham sp " +
            " JOIN san_pham_chi_tiet spct ON sp.id = spct.id_san_pham " +
            " JOIN danh_muc dm ON spct.id_danh_muc = dm.id " +
            " WHERE LOWER(dm.ten_danh_muc) LIKE LOWER(:tenDanhMuc) " +
            " AND LOWER(TRIM(sp.trang_thai)) = N'hoạt động'",
            nativeQuery = true)
    List<SanPham> getListSanPhamTheoTenDanhMucVaDangHoatDong(@Param("tenDanhMuc") String tenDanhMuc);

    @Query(value = " SELECT DISTINCT Top 3  sp.* FROM san_pham sp " +
            " JOIN san_pham_chi_tiet spct ON sp.id = spct.id_san_pham " +
            " JOIN danh_muc dm ON spct.id_danh_muc = dm.id " +
            " WHERE LOWER(dm.ten_danh_muc) LIKE LOWER(:tenDanhMuc) " +
            " AND LOWER(TRIM(sp.trang_thai)) = N'hoạt động' and sp.id != :idSanPham",
            nativeQuery = true)
    List<SanPham> getListSanPhamTheoTenDanhMucVaDangHoatDongTop3(@Param("tenDanhMuc") String tenDanhMuc,@Param("idSanPham") Integer idSanPham);

    @Query("SELECT spct.mauSac FROM SanPhamChiTiet spct WHERE spct.sanPham.id = :idSanPham AND spct.trangThai = :trangThai AND spct.danhMuc.tenDanhMuc = :danhMuc GROUP BY spct.mauSac")
    List<MauSac> getMauSacTheoIDSanPhamAndTrangThaiAndDanhMuc(@Param("idSanPham") Integer idSanPham, @Param("trangThai") String trangThai, @Param("danhMuc") String danhMuc);

    List<SanPhamChiTiet> findBySanPhamAndMauSacAndTrangThaiAndDanhMuc_TenDanhMuc(SanPham sanPham, MauSac mauSac, String trangThai, String tenDanhMuc);

    @Query("SELECT spct.mauSac FROM SanPhamChiTiet spct WHERE spct.sanPham.id = :idSanPham AND spct.trangThai = :trangThai GROUP BY spct.mauSac")
    List<MauSac> getMauSacTheoIDSanPhamAndTrangThai(@Param("idSanPham") Integer idSanPham, @Param("trangThai") String trangThai);


    List<SanPhamChiTiet> findBySanPhamAndMauSacAndTrangThai(SanPham sanPham, MauSac mauSac, String trangThai);




    @Query("SELECT hdct.sanPhamChiTiet.sanPham FROM HoaDonChiTiet hdct " +
            "WHERE hdct.hoaDon.trangThai = 'Hoàn thành' " +
            "AND hdct.sanPhamChiTiet.sanPham.trangThai = :trangThai " +
//            "AND (SELECT SUM(spct.soLuong) FROM SanPhamChiTiet spct WHERE spct.sanPham = hdct.sanPhamChiTiet.sanPham) > 0 " +
            "AND hdct.ngayTao BETWEEN :startDate AND :endDate " +  // Lọc theo khoảng ngày
            "AND hdct.sanPhamChiTiet.trangThai = :trangThai " +
            "GROUP BY hdct.sanPhamChiTiet.sanPham " +
            "ORDER BY SUM(hdct.soLuong) DESC")
    Page<SanPham> findTopSanPhamChiTietBanChay(@Param("trangThai") String trangThai, @Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate, Pageable pageable);

}
