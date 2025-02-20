package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.AnhSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnhSanPhamRepository extends JpaRepository<AnhSanPham,Integer> {
}
