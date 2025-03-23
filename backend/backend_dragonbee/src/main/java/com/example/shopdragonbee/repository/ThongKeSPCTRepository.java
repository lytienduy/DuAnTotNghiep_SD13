package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ThongKeSPCTRepository extends JpaRepository<SanPhamChiTiet, Integer> {
    @Query(value = "SELECT " +
            "asp.anh_url AS anhSanPham, " +
            "CONCAT(sp.ten_san_pham, ' [', ms.ten_mau_sac, ' - ', sz.ten_size ,']') AS tenSanPham, " +
            "spct.so_luong AS soLuongTon, " +
            "spct.gia AS giaSanPham " +
            "FROM san_pham_chi_tiet spct " +
            "JOIN san_pham sp ON spct.id_san_pham = sp.id " +
            "JOIN mau_sac ms ON spct.id_mau_sac = ms.id " +
            "JOIN size sz ON spct.id_size = sz.id " +
            "LEFT JOIN anh_san_pham asp ON spct.id = asp.id_san_pham_chi_tiet " +
            "WHERE spct.so_luong < :soLuong " +
            "ORDER BY spct.so_luong ASC",
            nativeQuery = true)
    List<Object[]> findSanPhamSapHetHang(@Param("soLuong") int soLuong);


    // Lấy danh sách sản phẩm dưới ngưỡng soLuong, phân trang bằng OFFSET...FETCH
    @Query(value = """
        SELECT asp.anh_url AS anhSanPham,
               CONCAT(sp.ten_san_pham, ' [', ms.ten_mau_sac, ' - ', sz.ten_size, ']') AS tenSanPham,
               spct.so_luong AS soLuongTon,
               spct.gia AS giaSanPham
        FROM san_pham_chi_tiet spct
        JOIN san_pham sp ON spct.id_san_pham = sp.id
        JOIN mau_sac ms ON spct.id_mau_sac = ms.id
        JOIN size sz ON spct.id_size = sz.id
        LEFT JOIN anh_san_pham asp ON spct.id = asp.id_san_pham_chi_tiet
        WHERE spct.so_luong < :soLuong
        ORDER BY spct.so_luong ASC
        OFFSET :offset ROWS
        FETCH NEXT :limit ROWS ONLY
    """, nativeQuery = true)
    List<Object[]> findSanPhamSapHetHangPaging(@Param("soLuong") int soLuong,
                                               @Param("offset") int offset,
                                               @Param("limit") int limit);


    // Đếm tổng số sản phẩm dưới ngưỡng soLuong (để tính tổng trang)
    @Query(value = """
        SELECT COUNT(*)
        FROM san_pham_chi_tiet spct
        WHERE spct.so_luong < :soLuong
    """, nativeQuery = true)
    int countSanPhamSapHetHang(@Param("soLuong") int soLuong);

    @Query(value = "SELECT TOP 2 sp.mo_ta AS moTa, sp.so_luong AS soLuong, sp.gia AS gia " +
            "FROM san_pham_chi_tiet sp " +
            "WHERE sp.so_luong > 0 " +
            "ORDER BY sp.so_luong ASC", nativeQuery = true)
    List<Object[]> findTop2SanPhamSapHetHang();

}
