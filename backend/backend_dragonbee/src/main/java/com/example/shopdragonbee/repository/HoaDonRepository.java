package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
    List<HoaDon> findByTrangThai(String trangThai);
    List<HoaDon> findByLoaiDon(String loaiDon);

    List<HoaDon> findByTrangThaiAndLoaiDon(String trangThai, String loaiDon);

//    List<HoaDon> findByTrangThaiAndLoaiDonAndnAndNgayTaoBetween(String trangThai, String loaiDon);

}
