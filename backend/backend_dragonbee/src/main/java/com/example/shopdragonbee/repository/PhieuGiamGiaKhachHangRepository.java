package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.entity.PhieuGiamGiaKhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuGiamGiaKhachHangRepository extends JpaRepository<PhieuGiamGiaKhachHang,Integer> {
    List<PhieuGiamGiaKhachHang> findByPhieuGiamGiaId(Integer phieuGiamGiaId);

    // Thêm phương thức xóa theo phieuGiamGiaId
    void deleteByPhieuGiamGiaId(Integer phieuGiamGiaId);

    // Tìm tất cả các PhieuGiamGiaKhachHang liên quan đến PhieuGiamGia
    List<PhieuGiamGiaKhachHang> findByPhieuGiamGia(PhieuGiamGia phieuGiamGia);

    // Thêm phương thức để cập nhật trạng thái khách hàng
    @Modifying
    @Query("UPDATE PhieuGiamGiaKhachHang p SET p.trangThai = :trangThai WHERE p.phieuGiamGia.id = :phieuGiamGiaId")
    void updateTrangThaiKhachHang(@Param("phieuGiamGiaId") Integer phieuGiamGiaId, @Param("trangThai") String trangThai);

    List<PhieuGiamGiaKhachHang> findByKhachHangId(Integer idKhachHang);

    List<PhieuGiamGiaKhachHang> findByKhachHang_Id(Integer idKhachHang);

}
