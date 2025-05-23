package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.SanPhamChiTietResponse;
import com.example.shopdragonbee.respone.SanPhamChiTietRespone;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SanPhamChiTietRepository extends JpaRepository<SanPhamChiTiet, Integer>, JpaSpecificationExecutor<SanPhamChiTiet> {

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


    List<SanPhamChiTiet> findBySanPhamId(Integer sanPhamId);

    List<SanPhamChiTiet> findByMauSac_TenMauSac(String color);
    List<SanPhamChiTiet> findBySize_TenSize(String size);
    List<SanPhamChiTiet> findByThuongHieu_TenThuongHieu(String brand);
    List<SanPhamChiTiet> findByChatLieu_TenChatLieu(String material);
    List<SanPhamChiTiet> findByXuatXu_TenXuatXu(String origin);
    List<SanPhamChiTiet> findByDanhMuc_TenDanhMuc(String category);
    List<SanPhamChiTiet> findByPhongCach_TenPhongCach(String style);
    List<SanPhamChiTiet> findByKieuDang_TenKieuDang(String kieuDang);
    List<SanPhamChiTiet> findByKieuDaiQuan_TenKieuDaiQuan(String kieuDaiQuan);

    @Query("""
    SELECT hct.sanPhamChiTiet, SUM(hct.soLuong) as totalQuantity
    FROM HoaDonChiTiet hct
    JOIN hct.hoaDon hd
    WHERE hd.trangThai = 'Hoàn thành'
    GROUP BY hct.sanPhamChiTiet
    ORDER BY totalQuantity DESC
    """)
    List<Object[]> findTopBestSellingProducts(Pageable pageable);

    @Query("SELECT new com.example.shopdragonbee.dto.SanPhamChiTietResponse(" +
            "spct.id, " +
            "CONCAT(sp.tenSanPham, ' - ', ms.tenMauSac, ' - ', s.tenSize), " +
            "dm.tenDanhMuc, th.tenThuongHieu, ms.tenMauSac, kd.tenKieuDang, spct.soLuong) " +
            "FROM SanPhamChiTiet spct " +
            "JOIN spct.sanPham sp " +
            "LEFT JOIN spct.danhMuc dm " +
            "LEFT JOIN spct.thuongHieu th " +
            "LEFT JOIN spct.mauSac ms " +
            "LEFT JOIN spct.kieuDang kd " +
            "LEFT JOIN spct.size s " +
            "WHERE sp.id IN :sanPhamIds")
    List<SanPhamChiTietResponse> findChiTietBySanPhamIds(@Param("sanPhamIds") List<Integer> sanPhamIds);

}
