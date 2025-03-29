package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.GioHang;
import com.example.shopdragonbee.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GioHangRepository extends JpaRepository<GioHang,Integer> {
    GioHang getGioHangByKhachHang(KhachHang khachHang);
}
