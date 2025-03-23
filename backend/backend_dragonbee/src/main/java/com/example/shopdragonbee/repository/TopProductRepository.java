package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface TopProductRepository extends JpaRepository<HoaDonChiTiet, Integer> {

    @Query(value = """
    SELECT TOP 10 
        STRING_AGG(asp.anh_url, ', ') AS danh_sach_anh, 
        CONCAT(sp.ten_san_pham, ' [ ', ms.ten_mau_sac, ' - ', sz.ten_size, ']') AS tenSanPham, 
        SUM(hdct.so_luong) AS tong_ban,
        spct.gia 
    FROM hoa_don_chi_tiet hdct
    JOIN hoa_don hd ON hdct.id_hoa_don = hd.id
    JOIN san_pham_chi_tiet spct ON hdct.id_san_pham_chi_tiet = spct.id
    JOIN san_pham sp ON spct.id_san_pham = sp.id
    JOIN mau_sac ms ON spct.id_mau_sac = ms.id
    JOIN size sz ON spct.id_size = sz.id
    LEFT JOIN anh_san_pham asp ON spct.id = asp.id_san_pham_chi_tiet
    WHERE hd.trang_thai = 'Hoàn thành'
      AND CAST(hd.ngay_tao AS DATE) = CAST(GETDATE() AS DATE)
    GROUP BY sp.ten_san_pham, ms.ten_mau_sac, sz.ten_size, spct.gia
    ORDER BY tong_ban DESC
""", nativeQuery = true)
    List<Object[]> findTopProductsToday();



    @Query(value = """
    SELECT TOP 10 
        STRING_AGG(asp.anh_url, ', ') AS danh_sach_anh,
        CONCAT(sp.ten_san_pham, ' [', ms.ten_mau_sac, ' - ', sz.ten_size, ']') AS tenSanPham,
        SUM(hdct.so_luong) AS tong_ban,
        spct.gia
    FROM hoa_don_chi_tiet hdct
    JOIN hoa_don hd ON hdct.id_hoa_don = hd.id
    JOIN san_pham_chi_tiet spct ON hdct.id_san_pham_chi_tiet = spct.id
    JOIN san_pham sp ON spct.id_san_pham = sp.id
    JOIN mau_sac ms ON spct.id_mau_sac = ms.id
    JOIN size sz ON spct.id_size = sz.id
    LEFT JOIN anh_san_pham asp ON spct.id = asp.id_san_pham_chi_tiet
    WHERE hd.trang_thai = 'Hoàn thành'
      AND hd.ngay_tao >= DATEADD(DAY, - (DATEPART(WEEKDAY, GETDATE()) + @@DATEFIRST - 2) % 7, CAST(GETDATE() AS DATE))
      AND hd.ngay_tao < DATEADD(DAY, 6, DATEADD(DAY, - (DATEPART(WEEKDAY, GETDATE()) + @@DATEFIRST - 2) % 7, CAST(GETDATE() AS DATE)))
    GROUP BY sp.ten_san_pham, ms.ten_mau_sac, sz.ten_size, spct.gia
    ORDER BY tong_ban DESC
""", nativeQuery = true)
    List<Object[]> findTopProductsThisWeek();



    @Query(value = """
    SELECT TOP 10 
        STRING_AGG(asp.anh_url, ', ') AS danh_sach_anh, 
        CONCAT(sp.ten_san_pham, ' [', ms.ten_mau_sac, ' - ', sz.ten_size, ']') AS tenSanPham,
        SUM(hdct.so_luong) AS tong_ban,
        spct.gia 
    FROM hoa_don_chi_tiet hdct
    JOIN hoa_don hd ON hdct.id_hoa_don = hd.id
    JOIN san_pham_chi_tiet spct ON hdct.id_san_pham_chi_tiet = spct.id
    JOIN san_pham sp ON spct.id_san_pham = sp.id
    JOIN mau_sac ms ON spct.id_mau_sac = ms.id
    JOIN size sz ON spct.id_size = sz.id
    LEFT JOIN anh_san_pham asp ON spct.id = asp.id_san_pham_chi_tiet
    WHERE hd.trang_thai = 'Hoàn thành'
      AND hd.ngay_tao BETWEEN DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) 
                           AND EOMONTH(GETDATE())
    GROUP BY sp.ten_san_pham, ms.ten_mau_sac, sz.ten_size, spct.gia
    ORDER BY tong_ban DESC
""", nativeQuery = true)
    List<Object[]> findTopProductsThisMonth();


    @Query(value = """
    SELECT TOP 10 
        STRING_AGG(asp.anh_url, ', ') AS danh_sach_anh, 
        CONCAT(sp.ten_san_pham, ' [', ms.ten_mau_sac, ' - ', sz.ten_size, ']') AS tenSanPham,
        SUM(hdct.so_luong) AS tong_ban,
        spct.gia 
    FROM hoa_don_chi_tiet hdct
    JOIN hoa_don hd ON hdct.id_hoa_don = hd.id
    JOIN san_pham_chi_tiet spct ON hdct.id_san_pham_chi_tiet = spct.id
    JOIN san_pham sp ON spct.id_san_pham = sp.id
    JOIN mau_sac ms ON spct.id_mau_sac = ms.id
    JOIN size sz ON spct.id_size = sz.id
    LEFT JOIN anh_san_pham asp ON spct.id = asp.id_san_pham_chi_tiet
    WHERE hd.trang_thai = 'Hoàn thành'
      AND hd.ngay_tao BETWEEN DATEFROMPARTS(YEAR(GETDATE()), 1, 1) 
                           AND DATEFROMPARTS(YEAR(GETDATE()), 12, 31)
    GROUP BY sp.ten_san_pham, ms.ten_mau_sac, sz.ten_size, spct.gia
    ORDER BY tong_ban DESC
""", nativeQuery = true)
    List<Object[]> findTopProductsThisYear();


    @Query(value = """
    SELECT TOP 10 
        STRING_AGG(asp.anh_url, ', ') AS danh_sach_anh,
        CONCAT(sp.ten_san_pham, ' [', ms.ten_mau_sac, ' - ', sz.ten_size, ']') AS tenSanPham,
        SUM(hdct.so_luong) AS soLuongBan,
        spct.gia AS giaBan
    FROM hoa_don_chi_tiet hdct
    JOIN hoa_don hd ON hdct.id_hoa_don = hd.id
    JOIN san_pham_chi_tiet spct ON hdct.id_san_pham_chi_tiet = spct.id
    JOIN san_pham sp ON spct.id_san_pham = sp.id
    JOIN mau_sac ms ON spct.id_mau_sac = ms.id
    JOIN size sz ON spct.id_size = sz.id
    LEFT JOIN anh_san_pham asp ON spct.id = asp.id_san_pham_chi_tiet
    WHERE hd.trang_thai = 'Hoàn thành'
          AND hd.ngay_tao >= CAST(:startDate AS DATETIME)
          AND hd.ngay_tao < DATEADD(DAY, 1, CAST(:endDate AS DATETIME))
    GROUP BY sp.ten_san_pham, ms.ten_mau_sac, sz.ten_size, spct.gia
    ORDER BY soLuongBan DESC
""", nativeQuery = true)
    List<Object[]> findTopBestSellingBetween(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );


}

