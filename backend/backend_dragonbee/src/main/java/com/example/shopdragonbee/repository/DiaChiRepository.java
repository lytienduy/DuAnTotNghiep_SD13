package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaChiRepository extends JpaRepository<DiaChi, Integer> {
    // Phương thức tìm địa chỉ theo ID khách hàng
    List<DiaChi> findByKhachHangId(Integer customerId);
}
