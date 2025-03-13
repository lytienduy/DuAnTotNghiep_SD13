package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.AnhSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnhSanPhamRepository extends JpaRepository<AnhSanPham,Integer> {
    List<AnhSanPham> findBySanPhamChiTietId(Integer sanPhamChiTietId);
    Optional<AnhSanPham> findByAnhUrl(String anhUrl);
    @Query("SELECT MAX(a.id) FROM AnhSanPham a")
    Integer getMaxId();
}
