package com.example.shopdragonbee.repository;


import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.entity.HoaDonChiTiet;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Integer> {

    HoaDonChiTiet getHoaDonChiTietByHoaDonAndSanPhamChiTietAndDonGia(HoaDon hoaDon, SanPhamChiTiet sanPhamChiTiet,Float donGia);

}
