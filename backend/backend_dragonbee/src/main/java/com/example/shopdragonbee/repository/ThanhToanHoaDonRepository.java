package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.ThanhToanHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ThanhToanHoaDonRepository extends JpaRepository<ThanhToanHoaDon,Integer> {
//    @Query("SELECT COALESCE(SUM(hdct.soTienThanhToan), 0) FROM ThanhToanHoaDon hdct WHERE hdct.hoaDon.id = :idHoaDon")
//    Float tinhTongTienDaThanhToanByHoaDonId(@Param("idHoaDon") Integer idHoaDon);
}
