package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.respone.SanPhamChiTietRespone;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SanPhamChiTietRepository extends JpaRepository<SanPhamChiTiet, Integer> {

    @Query("SELECT new com.example.shopdragonbee.respone.SanPhamChiTietRespone(" +
            "spct.id, spct.ma, sp.tenSanPham, dm.tenDanhMuc, th.tenThuongHieu, pc.tenPhongCach, " +
            "cl.tenChatLieu, ms.tenMauSac, sz.tenSize, kd.tenKieuDang, kdq.tenKieuDaiQuan, xx.tenXuatXu, " +
            "spct.soLuong, spct.gia, spct.trangThai) " +
            "FROM SanPhamChiTiet spct " +
            "JOIN spct.sanPham sp " +
            "LEFT JOIN spct.danhMuc dm " +
            "LEFT JOIN spct.thuongHieu th " +
            "LEFT JOIN spct.phongCach pc " +
            "LEFT JOIN spct.chatLieu cl " +
            "LEFT JOIN spct.mauSac ms " +
            "LEFT JOIN spct.size sz " +
            "LEFT JOIN spct.kieuDang kd " +
            "LEFT JOIN spct.kieuDaiQuan kdq " +
            "LEFT JOIN spct.xuatXu xx ")
    Page<SanPhamChiTietRespone> findAllSanPhamChiTiet(Pageable pageable);


    @Query("SELECT new com.example.shopdragonbee.respone.SanPhamChiTietRespone(" +
            "spct.id, spct.ma, sp.tenSanPham, dm.tenDanhMuc, th.tenThuongHieu, pc.tenPhongCach, " +
            "cl.tenChatLieu, ms.tenMauSac, sz.tenSize, kd.tenKieuDang, kdq.tenKieuDaiQuan, xx.tenXuatXu, " +
            "spct.soLuong, spct.gia, spct.trangThai) " +
            "FROM SanPhamChiTiet spct " +
            "JOIN spct.sanPham sp " +
            "LEFT JOIN spct.danhMuc dm " +
            "LEFT JOIN spct.thuongHieu th " +
            "LEFT JOIN spct.phongCach pc " +
            "LEFT JOIN spct.chatLieu cl " +
            "LEFT JOIN spct.mauSac ms " +
            "LEFT JOIN spct.size sz " +
            "LEFT JOIN spct.kieuDang kd " +
            "LEFT JOIN spct.kieuDaiQuan kdq " +
            "LEFT JOIN spct.xuatXu xx " +
            "WHERE spct.sanPham.id = :sanPhamId")
    Page<SanPhamChiTietRespone> findBySanPhamId(@Param("sanPhamId") Integer id, Pageable pageable);


    @Query("SELECT COALESCE(MAX(spct.id), 0) FROM SanPhamChiTiet spct")
    Integer getMaxId();
    SanPhamChiTiet findById(int id);

    // search
    @Query("SELECT sp FROM SanPhamChiTiet sp " +
            "WHERE (:tenSanPham IS NULL OR LOWER(sp.sanPham.tenSanPham) LIKE LOWER(CONCAT('%', :tenSanPham, '%'))) " +
            "AND (:danhMucId IS NULL OR sp.danhMuc.id = :danhMucId) " +
            "AND (:thuongHieuId IS NULL OR sp.thuongHieu.id = :thuongHieuId) " +
            "AND (:phongCachId IS NULL OR sp.phongCach.id = :phongCachId) " +
            "AND (:chatLieuId IS NULL OR sp.chatLieu.id = :chatLieuId) " +
            "AND (:kieuDangId IS NULL OR sp.kieuDang.id = :kieuDangId) " +
            "AND (:kieuDaiQuanId IS NULL OR sp.kieuDaiQuan.id = :kieuDaiQuanId) " +
            "AND (:xuatXuId IS NULL OR sp.xuatXu.id = :xuatXuId) " +
            "AND (:mauSacId IS NULL OR sp.mauSac.id = :mauSacId) " +
            "AND (:sizeId IS NULL OR sp.size.id = :sizeId) " +
            "AND (:giaMin IS NULL OR sp.gia >= :giaMin) " +
            "AND (:giaMax IS NULL OR sp.gia <= :giaMax)")
    List<SanPhamChiTiet> searchSanPham(
            @Param("tenSanPham") String tenSanPham,
            @Param("danhMucId") Integer danhMucId,
            @Param("thuongHieuId") Integer thuongHieuId,
            @Param("phongCachId") Integer phongCachId,
            @Param("chatLieuId") Integer chatLieuId,
            @Param("kieuDangId") Integer kieuDangId,
            @Param("kieuDaiQuanId") Integer kieuDaiQuanId,
            @Param("xuatXuId") Integer xuatXuId,
            @Param("mauSacId") Integer mauSacId,
            @Param("sizeId") Integer sizeId,
            @Param("giaMin") Double giaMin,
            @Param("giaMax") Double giaMax);

}
