package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.AnhSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnhSanPhamRepository extends JpaRepository<AnhSanPham,Integer> {
    List<AnhSanPham> findBySanPhamChiTietId(Integer sanPhamChiTietId);
}
