package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.respone.SanPhamChiTietRespone;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SanPhamChiTietRepository extends JpaRepository<SanPhamChiTiet, Integer> {

    @EntityGraph(attributePaths = {
            "sanPham", "danhMuc", "thuongHieu", "phongCach", "chatLieu",
            "mauSac", "size", "kieuDang", "kieuDaiQuan", "xuatXu"
    })
    @Query("SELECT spct FROM SanPhamChiTiet spct")
    Page<SanPhamChiTiet> findAllWithJoins(Pageable pageable);

    @EntityGraph(attributePaths = {
            "sanPham", "danhMuc", "thuongHieu", "phongCach", "chatLieu",
            "mauSac", "size", "kieuDang", "kieuDaiQuan", "xuatXu"
    })
    @Query("SELECT spct FROM SanPhamChiTiet spct WHERE spct.sanPham.id = :id")
    Page<SanPhamChiTiet> findBySanPhamIdWithJoins(@Param("id") Integer id, Pageable pageable);






    @Query("SELECT COALESCE(MAX(spct.id), 0) FROM SanPhamChiTiet spct")
    Integer getMaxId();

    @Query("SELECT spct FROM SanPhamChiTiet spct LEFT JOIN FETCH spct.listAnh WHERE spct.id = :id")
    Optional<SanPhamChiTiet> findByIdWithAnh(@Param("id") Integer id);

    SanPhamChiTiet findById(int id);

    // tìm kiếm
    @Query("SELECT spct FROM SanPhamChiTiet spct WHERE LOWER(spct.sanPham.tenSanPham) LIKE LOWER(CONCAT('%', :ten, '%'))")
    List<SanPhamChiTiet> searchByTenSanPham(@Param("ten") String ten);




}
