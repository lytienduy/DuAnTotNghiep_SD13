package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.respone.SanPhamChiTietRespone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SanPhamChiTietRepository extends JpaRepository<SanPhamChiTiet,Integer> {

    @Query("SELECT new com.example.shopdragonbee.respone.SanPhamChiTietRespone( "
            + "spct.id, spct.ma, spct.soLuong, spct.moTa, sp.trangThai, spct.gia, "
            + "sp.ma, sp.tenSanPham, "
            + "COALESCE(ms.tenMauSac, ''), "
            + "COALESCE(cl.tenChatLieu, ''), "
            + "COALESCE(dm.tenDanhMuc, ''), "
            + "COALESCE(sz.tenSize, ''), "
            + "COALESCE(th.tenThuongHieu, ''), "
            + "COALESCE(kd.tenKieuDang, ''), "
            + "COALESCE(kdq.tenKieuDaiQuan, ''), "
            + "COALESCE(xx.tenXuatXu, ''), "
            + "COALESCE(pc.tenPhongCach, ''), "
            + "spct.ngayTao, spct.ngaySua, spct.nguoiTao, spct.nguoiSua) "
            + "FROM SanPhamChiTiet spct "
            + "JOIN spct.sanPham sp "
            + "LEFT JOIN spct.mauSac ms "
            + "LEFT JOIN spct.chatLieu cl "
            + "LEFT JOIN spct.danhMuc dm "
            + "LEFT JOIN spct.size sz "
            + "LEFT JOIN spct.thuongHieu th "
            + "LEFT JOIN spct.kieuDang kd "
            + "LEFT JOIN spct.kieuDaiQuan kdq "
            + "LEFT JOIN spct.xuatXu xx "
            + "LEFT JOIN spct.phongCach pc "
            + "WHERE sp.id = :sanPhamId")
    List<SanPhamChiTietRespone> findBySanPhamId(@Param("sanPhamId") Integer sanPhamId);


    boolean existsByMa(String ma);
    // phân trang
    @Query("SELECT new com.example.shopdragonbee.respone.SanPhamChiTietRespone( "
            + "spct.id, spct.ma, spct.soLuong, spct.moTa, sp.trangThai, spct.gia, "
            + "sp.ma, sp.tenSanPham, "
            + "COALESCE(ms.tenMauSac, ''), "
            + "COALESCE(cl.tenChatLieu, ''), "
            + "COALESCE(dm.tenDanhMuc, ''), "
            + "COALESCE(sz.tenSize, ''), "
            + "COALESCE(th.tenThuongHieu, ''), "
            + "COALESCE(kd.tenKieuDang, ''), "
            + "COALESCE(kdq.tenKieuDaiQuan, ''), "
            + "COALESCE(xx.tenXuatXu, ''), "
            + "COALESCE(pc.tenPhongCach, ''), "
            + "spct.ngayTao, spct.ngaySua, spct.nguoiTao, spct.nguoiSua) "
            + "FROM SanPhamChiTiet spct "
            + "JOIN spct.sanPham sp "
            + "LEFT JOIN spct.mauSac ms "
            + "LEFT JOIN spct.chatLieu cl "
            + "LEFT JOIN spct.danhMuc dm "
            + "LEFT JOIN spct.size sz "
            + "LEFT JOIN spct.thuongHieu th "
            + "LEFT JOIN spct.kieuDang kd "
            + "LEFT JOIN spct.kieuDaiQuan kdq "
            + "LEFT JOIN spct.xuatXu xx "
            + "LEFT JOIN spct.phongCach pc ")
    Page<SanPhamChiTietRespone> getChiTietPaged(Pageable pageable);
    @Query("SELECT COALESCE(MAX(spct.id), 0) FROM SanPhamChiTiet spct")
    Integer getMaxId();
}
