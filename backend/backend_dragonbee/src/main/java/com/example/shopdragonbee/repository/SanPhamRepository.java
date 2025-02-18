package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.respone.SanPhamRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.shopdragonbee.entity.SanPham;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {

    @Query("""
        SELECT new com.example.shopdragonbee.respone.SanPhamRespone(
            sp.id,
            sp.ma,
            sp.tenSanPham,
            COALESCE(SUM(spct.soLuong), 0), 
            sp.ngayTao,
            sp.trangThai
        )
        FROM SanPham sp
        LEFT JOIN SanPhamChiTiet spct ON sp.id = spct.sanPham.id
        GROUP BY sp.id, sp.ma, sp.tenSanPham, sp.ngayTao, sp.trangThai
    """)
    List<SanPhamRespone> getAll();

    @Query("""
        SELECT new com.example.shopdragonbee.respone.SanPhamRespone(
            sp.id,
            sp.ma,
            sp.tenSanPham,
            COALESCE(SUM(spct.soLuong), 0), 
            sp.ngayTao,
            sp.trangThai
        )
        FROM SanPham sp
        LEFT JOIN SanPhamChiTiet spct ON sp.id = spct.sanPham.id
        GROUP BY sp.id, sp.ma, sp.tenSanPham, sp.ngayTao, sp.trangThai
    """)
    Page<SanPhamRespone> getAllPaged(Pageable pageable);

    // tìm kiếm và bộ lọc
    @Query("""
    SELECT new com.example.shopdragonbee.respone.SanPhamRespone(
        sp.id,
        sp.ma,
        sp.tenSanPham,
        COALESCE(SUM(spct.soLuong), 0), 
        sp.ngayTao,
        sp.trangThai
    )
    FROM SanPham sp
    LEFT JOIN SanPhamChiTiet spct ON sp.id = spct.sanPham.id
    WHERE (:tenSanPham IS NULL OR LOWER(sp.tenSanPham) LIKE LOWER(CONCAT('%', :tenSanPham, '%')))
    AND (:trangThai IS NULL OR LOWER(sp.trangThai) = LOWER(:trangThai))
    GROUP BY sp.id, sp.ma, sp.tenSanPham, sp.ngayTao, sp.trangThai
""")
    Page<SanPhamRespone> searchSanPham(
            @Param("tenSanPham") String tenSanPham,
            @Param("trangThai") String trangThai,
            Pageable pageable
    );

    @Query("SELECT MAX(s.ma) FROM SanPham s")
    String findLastMaSanPham();

    Optional<SanPham> findByTenSanPham(String tenSanPham);

}
