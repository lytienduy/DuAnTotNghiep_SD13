package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RevenueGrowthRepository extends JpaRepository<HoaDonChiTiet, Integer> {

    // 1. Doanh thu và tốc độ tăng trưởng doanh thu ngày
    @Query(value = """
        SELECT newRev AS dayRevenue,
               CASE WHEN oldRev = 0 THEN 0
                    ELSE ((newRev - oldRev)*100.0/oldRev) END AS dayGrowth
        FROM (
            SELECT 
                (SELECT ISNULL(SUM(tong_tien),0) 
                 FROM hoa_don 
                 WHERE CAST(ngay_tao AS DATE) = CAST(GETDATE() AS DATE)
                   AND trang_thai = 'Hoàn thành'
                ) AS newRev,
                (SELECT ISNULL(SUM(tong_tien),0) 
                 FROM hoa_don 
                 WHERE CAST(ngay_tao AS DATE) = CAST(DATEADD(DAY, -1, GETDATE()) AS DATE)
                   AND trang_thai = 'Hoàn thành'
                ) AS oldRev
        ) t
    """, nativeQuery = true)
    Object getDayGrowth();

    // 2. Doanh thu và tốc độ tăng trưởng doanh thu tuần
    @Query(value = """
       SELECT\s
               newRev AS weekRevenue,
               CASE\s
                   WHEN oldRev = 0 THEN 0
                   ELSE ((newRev - oldRev) * 100.0 / oldRev)\s
               END AS weekGrowth
           FROM (
               SELECT\s
                   (SELECT ISNULL(SUM(tong_tien), 0)
                    FROM hoa_don\s
                    WHERE ngay_tao BETWEEN DATEADD(DAY, -6, CAST(GETDATE() AS DATE)) AND CAST(GETDATE() AS DATE)
                      AND trang_thai = 'Hoàn thành'
                   ) AS newRev,
                   (SELECT ISNULL(SUM(tong_tien), 0)
                    FROM hoa_don\s
                    WHERE ngay_tao BETWEEN DATEADD(DAY, -13, CAST(GETDATE() AS DATE))\s
                                      AND DATEADD(DAY, -7, CAST(GETDATE() AS DATE))
                      AND trang_thai = 'Hoàn thành'
                   ) AS oldRev
           ) t
           
    """, nativeQuery = true)
    Object getWeekGrowth();



    // 3. Doanh thu và tốc độ tăng trưởng doanh thu tháng
    @Query(value = """
        SELECT newRev AS monthRevenue,
               CASE WHEN oldRev = 0 THEN 0
                    ELSE ((newRev - oldRev)*100.0/oldRev) END AS monthGrowth
        FROM (
            SELECT 
                (SELECT ISNULL(SUM(tong_tien),0)
                 FROM hoa_don
                 WHERE MONTH(ngay_tao) = MONTH(GETDATE())
                   AND YEAR(ngay_tao) = YEAR(GETDATE())
                   AND trang_thai = 'Hoàn thành'
                ) AS newRev,
                (SELECT ISNULL(SUM(tong_tien),0)
                 FROM hoa_don
                 WHERE MONTH(ngay_tao) = MONTH(DATEADD(MONTH, -1, GETDATE()))
                   AND YEAR(ngay_tao) = YEAR(DATEADD(MONTH, -1, GETDATE()))
                   AND trang_thai = 'Hoàn thành'
                ) AS oldRev
        ) t
    """, nativeQuery = true)
    Object getMonthGrowth();

    // 4. Doanh thu và tốc độ tăng trưởng doanh thu năm
    @Query(value = """
        SELECT newRev AS yearRevenue,
               CASE WHEN oldRev = 0 THEN 0
                    ELSE ((newRev - oldRev)*100.0/oldRev) END AS yearGrowth
        FROM (
            SELECT 
                (SELECT ISNULL(SUM(tong_tien),0)
                 FROM hoa_don
                 WHERE YEAR(ngay_tao) = YEAR(GETDATE())
                   AND trang_thai = 'Hoàn thành'
                ) AS newRev,
                (SELECT ISNULL(SUM(tong_tien),0)
                 FROM hoa_don
                 WHERE YEAR(ngay_tao) = YEAR(DATEADD(YEAR, -1, GETDATE()))
                   AND trang_thai = 'Hoàn thành'
                ) AS oldRev
        ) t
    """, nativeQuery = true)
    Object getYearGrowth();
}
