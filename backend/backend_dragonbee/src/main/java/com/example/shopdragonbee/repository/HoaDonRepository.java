package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer>, JpaSpecificationExecutor<HoaDon> {
    Integer countByTrangThai(String trangThai);
    Integer countByTrangThaiAndLoaiDon(String trangThai,String loaiDon);



}
