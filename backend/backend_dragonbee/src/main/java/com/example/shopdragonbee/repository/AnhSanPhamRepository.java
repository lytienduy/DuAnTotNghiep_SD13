package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.AnhSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnhSanPhamRepository extends JpaRepository<AnhSanPham,Integer> {
    List<AnhSanPham> findBySanPhamChiTietId(Integer sanPhamChiTietId);
    Optional<AnhSanPham> findByAnhUrl(String anhUrl);
    @Query("SELECT MAX(a.id) FROM AnhSanPham a")
    Integer getMaxId();

    @Query("SELECT asp.sanPhamChiTiet.id, asp.anhUrl " +
            "FROM AnhSanPham asp " +
            "WHERE asp.sanPhamChiTiet.id IN :ids")
    List<Object[]> findAnhSanPhamBySanPhamChiTietIds(@Param("ids") List<Integer> ids);
}
