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

    // tìm kiếm
    @Query("SELECT spct FROM SanPhamChiTiet spct WHERE LOWER(spct.sanPham.tenSanPham) LIKE LOWER(CONCAT('%', :ten, '%'))")
    List<SanPhamChiTiet> searchByTenSanPham(@Param("ten") String ten);

}
