package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    KhachHang findKhachHangByMa(String ma);
}
