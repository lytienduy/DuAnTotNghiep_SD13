package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer>, JpaSpecificationExecutor<HoaDon> {
    Integer countByTrangThai(String trangThai);
    Integer countByLoaiDon(String loaiDon);
    Integer countByTrangThaiAndLoaiDon(String trangThai,String loaiDon);


    @Query("SELECT COALESCE(SUM(hdct.soLuong * hdct.donGia), 0) FROM HoaDonChiTiet hdct WHERE hdct.hoaDon.id = :idHoaDon")
    Float tinhTongTienByHoaDonId(@Param("idHoaDon") Integer idHoaDon);

}
