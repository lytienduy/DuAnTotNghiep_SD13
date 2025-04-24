package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.SanPhamDTO;
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
    SELECT new com.example.shopdragonbee.dto.SanPhamDTO(
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
    ORDER BY sp.ngayTao DESC
""")
    List<SanPhamDTO> getAll();



    @Query("""
    SELECT new com.example.shopdragonbee.dto.SanPhamDTO(
        sp.id,
        sp.ma,
        sp.tenSanPham,
        COALESCE(SUM(spct.soLuong), 0) AS tongSoLuong,
        sp.ngayTao,
        CASE 
            WHEN COALESCE(SUM(spct.soLuong), 0) = 0 THEN 'Hết hàng' 
            ELSE sp.trangThai 
        END AS trangThai
    )
    FROM SanPham sp
    LEFT JOIN SanPhamChiTiet spct ON sp.id = spct.sanPham.id
    GROUP BY sp.id, sp.ma, sp.tenSanPham, sp.ngayTao, sp.trangThai
    ORDER BY sp.ngayTao DESC
""")
    Page<SanPhamDTO> getAllPaged(Pageable pageable);


    @Query("""
SELECT new com.example.shopdragonbee.dto.SanPhamDTO(
    sp.id,
    sp.ma,
    sp.tenSanPham,
    COALESCE(SUM(spct.soLuong), 0),
    sp.ngayTao,
    CASE 
        WHEN COALESCE(SUM(spct.soLuong), 0) = 0 THEN 'Hết hàng' 
        ELSE sp.trangThai 
    END
)
FROM SanPham sp
LEFT JOIN SanPhamChiTiet spct ON sp.id = spct.sanPham.id
WHERE (:tenSanPham IS NULL OR LOWER(sp.tenSanPham) LIKE CONCAT('%', LOWER(:tenSanPham), '%'))
GROUP BY sp.id, sp.ma, sp.tenSanPham, sp.ngayTao, sp.trangThai
ORDER BY sp.ngayTao DESC
""")
    Page<SanPhamDTO> searchSanPhamAll(
            @Param("tenSanPham") String tenSanPham,
            Pageable pageable
    );






    @Query("""
    SELECT new com.example.shopdragonbee.dto.SanPhamDTO(
        sp.id,
        sp.ma,
        sp.tenSanPham,
        COALESCE(SUM(spct.soLuong), 0) AS tongSoLuong,
        sp.ngayTao,
        CASE
            WHEN COALESCE(SUM(spct.soLuong), 0) = 0 THEN 'Hết hàng'
            ELSE sp.trangThai
        END
    )
    FROM SanPham sp
    LEFT JOIN SanPhamChiTiet spct ON sp.id = spct.sanPham.id
    WHERE (:tenSanPham IS NULL OR LOWER(sp.tenSanPham) LIKE CONCAT('%', LOWER(:tenSanPham), '%'))
    AND  sp.trangThai like "Hoạt động"
    GROUP BY sp.id, sp.ma, sp.tenSanPham, sp.ngayTao, sp.trangThai
    Having COALESCE(SUM(spct.soLuong), 0) = 0
    ORDER BY sp.ngayTao DESC
""")
    Page<SanPhamDTO> searchSanPhamHetHang(
            @Param("tenSanPham") String tenSanPham,
            @Param("trangThai") String trangThai,
            Pageable pageable
    );

    @Query("SELECT MAX(s.ma) FROM SanPham s")
    String findLastMaSanPham();

    Optional<SanPham> findByTenSanPham(String tenSanPham);

}
