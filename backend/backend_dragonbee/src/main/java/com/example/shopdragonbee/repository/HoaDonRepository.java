package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer>, JpaSpecificationExecutor<HoaDon> {

    @Query("SELECT COALESCE(SUM(hdct.soLuong * hdct.donGia), 0) FROM HoaDonChiTiet hdct WHERE hdct.hoaDon.id = :idHoaDon")
    Float tinhTongTienByHoaDonId(@Param("idHoaDon") Integer idHoaDon);
    // 1. Thống kê theo ngày
    @Query(value = """
    WITH AllStatuses AS (
      SELECT N'Chờ xác nhận' AS trangThai
      UNION ALL
      SELECT N'Đã xác nhận'
      UNION ALL
      SELECT N'Chờ giao hàng'
      UNION ALL
      SELECT N'Đang vận chuyển'
      UNION ALL
      SELECT N'Đã giao hàng'
      UNION ALL
      SELECT N'Chờ thanh toán'
      UNION ALL
      SELECT N'Đã thanh toán'
      UNION ALL
      SELECT N'Hoàn thành'
      UNION ALL
      SELECT N'Đã hủy'
    )
    SELECT 
      s.trangThai,
      ISNULL(o.soLuong, 0) AS soLuong
    FROM AllStatuses s
    LEFT JOIN (
      SELECT hd.trang_thai AS trangThai,
             COUNT(*) AS soLuong
      FROM hoa_don hd
      WHERE hd.trang_thai IN (
        N'Chờ xác nhận', N'Đã xác nhận', N'Chờ giao hàng', N'Đang vận chuyển',
        N'Đã giao hàng', N'Chờ thanh toán', N'Đã thanh toán', N'Hoàn thành', N'Đã hủy'
      )
      AND CAST(hd.ngay_tao AS DATE) = CAST(GETDATE() AS DATE)
      GROUP BY hd.trang_thai
    ) o ON s.trangThai = o.trangThai
""", nativeQuery = true)
    List<Object[]> findOrderStatusStatsToday();


    @Query(value = """
    WITH AllStatuses AS (
      SELECT N'Chờ xác nhận' AS trangThai
      UNION ALL
      SELECT N'Đã xác nhận'
      UNION ALL
      SELECT N'Chờ giao hàng'
      UNION ALL
      SELECT N'Đang vận chuyển'
      UNION ALL
      SELECT N'Đã giao hàng'
      UNION ALL
      SELECT N'Chờ thanh toán'
      UNION ALL
      SELECT N'Đã thanh toán'
      UNION ALL
      SELECT N'Hoàn thành'
      UNION ALL
      SELECT N'Đã hủy'
    )
    SELECT 
      s.trangThai,
      ISNULL(o.soLuong, 0) AS soLuong
    FROM AllStatuses s
    LEFT JOIN (
      SELECT hd.trang_thai AS trangThai,
             COUNT(*) AS soLuong
      FROM hoa_don hd
      WHERE hd.trang_thai IN (
        N'Chờ xác nhận', N'Đã xác nhận', N'Chờ giao hàng', N'Đang vận chuyển',
        N'Đã giao hàng', N'Chờ thanh toán', N'Đã thanh toán', N'Hoàn thành', N'Đã hủy'
      )
      AND hd.ngay_tao >= DATEADD(DAY, - (DATEPART(WEEKDAY, GETDATE()) + 5) % 7, CAST(GETDATE() AS DATE)) -- Lấy thứ 2 đầu tuần
      AND hd.ngay_tao < DATEADD(DAY, 7, DATEADD(DAY, - (DATEPART(WEEKDAY, GETDATE()) + 5) % 7, CAST(GETDATE() AS DATE))) -- Lấy hết Chủ nhật
      GROUP BY hd.trang_thai
    ) o ON s.trangThai = o.trangThai
""", nativeQuery = true)
    List<Object[]> findOrderStatusStatsThisWeek();




    // 3. Thống kê theo tháng
    @Query(value = """
    WITH AllStatuses AS (
      SELECT N'Chờ xác nhận' AS trangThai
      UNION ALL
      SELECT N'Đã xác nhận'
      UNION ALL
      SELECT N'Chờ giao hàng'
      UNION ALL
      SELECT N'Đang vận chuyển'
      UNION ALL
      SELECT N'Đã giao hàng'
      UNION ALL
      SELECT N'Chờ thanh toán'
      UNION ALL
      SELECT N'Đã thanh toán'
      UNION ALL
      SELECT N'Hoàn thành'
      UNION ALL
      SELECT N'Đã hủy'
    )
    SELECT 
      s.trangThai,
      ISNULL(o.soLuong, 0) AS soLuong
    FROM AllStatuses s
    LEFT JOIN (
      SELECT hd.trang_thai AS trangThai,
             COUNT(*) AS soLuong
      FROM hoa_don hd
      WHERE hd.trang_thai IN (
        N'Chờ xác nhận', N'Đã xác nhận', N'Chờ giao hàng', N'Đang vận chuyển',
        N'Đã giao hàng', N'Chờ thanh toán', N'Đã thanh toán', N'Hoàn thành', N'Đã hủy'
      )
      AND YEAR(hd.ngay_tao) = YEAR(GETDATE())
      AND MONTH(hd.ngay_tao) = MONTH(GETDATE())
      GROUP BY hd.trang_thai
    ) o ON s.trangThai = o.trangThai
""", nativeQuery = true)
    List<Object[]> findOrderStatusStatsThisMonth();


    // 4. Thống kê theo năm
    @Query(value = """
    WITH AllStatuses AS (
      SELECT N'Chờ xác nhận' AS trangThai
      UNION ALL
      SELECT N'Đã xác nhận'
      UNION ALL
      SELECT N'Chờ giao hàng'
      UNION ALL
      SELECT N'Đang vận chuyển'
      UNION ALL
      SELECT N'Đã giao hàng'
      UNION ALL
      SELECT N'Chờ thanh toán'
      UNION ALL
      SELECT N'Đã thanh toán'
      UNION ALL
      SELECT N'Hoàn thành'
      UNION ALL
      SELECT N'Đã hủy'
    )
    SELECT 
      s.trangThai,
      ISNULL(o.soLuong, 0) AS soLuong
    FROM AllStatuses s
    LEFT JOIN (
      SELECT hd.trang_thai AS trangThai,
             COUNT(*) AS soLuong
      FROM hoa_don hd
      WHERE hd.trang_thai IN (
        N'Chờ xác nhận', N'Đã xác nhận', N'Chờ giao hàng', N'Đang vận chuyển',
        N'Đã giao hàng', N'Chờ thanh toán', N'Đã thanh toán', N'Hoàn thành', N'Đã hủy'
      )
      AND YEAR(hd.ngay_tao) = YEAR(GETDATE())
      GROUP BY hd.trang_thai
    ) o ON s.trangThai = o.trangThai
""", nativeQuery = true)
    List<Object[]> findOrderStatusStatsThisYear();

    //5. Tùy chỉnh
    @Query(value = """
    WITH AllStatuses AS (
      SELECT N'Chờ xác nhận' AS trangThai
      UNION ALL SELECT N'Đã xác nhận'
      UNION ALL SELECT N'Chờ giao hàng'
      UNION ALL SELECT N'Đang vận chuyển'
      UNION ALL SELECT N'Đã giao hàng'
      UNION ALL SELECT N'Chờ thanh toán'
      UNION ALL SELECT N'Đã thanh toán'
      UNION ALL SELECT N'Hoàn thành'
      UNION ALL SELECT N'Đã hủy'
    )
    SELECT 
      s.trangThai,
      ISNULL(o.soLuong, 0) AS soLuong
    FROM AllStatuses s
    LEFT JOIN (
      SELECT hd.trang_thai AS trangThai,
             COUNT(*) AS soLuong
      FROM hoa_don hd
      WHERE hd.trang_thai IN (
        N'Chờ xác nhận', N'Đã xác nhận', N'Chờ giao hàng', N'Đang vận chuyển',
        N'Đã giao hàng', N'Chờ thanh toán', N'Đã thanh toán', N'Hoàn thành', N'Đã hủy'
      )
      AND hd.ngay_tao >= :startDate
      AND hd.ngay_tao <= DATEADD(SECOND, 86399, :endDate)
      GROUP BY hd.trang_thai
    ) o ON s.trangThai = o.trangThai
""", nativeQuery = true)
    List<Object[]> findOrderStatusStatsCustom(@Param("startDate") String startDate,
                                              @Param("endDate") String endDate);


    List<HoaDon> getHoaDonByTrangThaiInAndLoaiDonOrderByNgayTaoAsc(List<String> trangThaitrangThai, String loaiDon);

    HoaDon findHoaDonByMa(String ma);

    List<HoaDon> getHoaDonByTrangThaiAndKhachHangOrderByNgayTaoDesc(String trangThai, KhachHang khachHang);

}