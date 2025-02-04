package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.PhieuGiamGiaKhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuGiamGiaKhachHangRepository extends JpaRepository<PhieuGiamGiaKhachHang,Integer> {
    List<PhieuGiamGiaKhachHang> findByPhieuGiamGiaId(Integer phieuGiamGiaId);

    // Thêm phương thức xóa theo phieuGiamGiaId
    void deleteByPhieuGiamGiaId(Integer phieuGiamGiaId);
}
