package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    KhachHang findKhachHangByMa(String ma);

    // Tìm kiếm khách hàng theo tên hoặc số điện thoại
    List<KhachHang> findByTenKhachHangContainingIgnoreCaseOrSdtContainingIgnoreCase(String tenKhachHang, String sdt);

    @Query(value = "SELECT MAX(CAST(SUBSTRING(ma, 3, LEN(ma) - 2) AS INT)) FROM khach_hang", nativeQuery = true)
    Integer getMaxMa();

    boolean existsByEmail(String email);
}
