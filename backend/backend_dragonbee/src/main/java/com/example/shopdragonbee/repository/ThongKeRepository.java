package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.respone.RevenueResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ThongKeRepository {

    private final JdbcTemplate jdbcTemplate;

    // Thống kê doanh thu, số lượng sản phẩm, đơn thành công, đơn hủy theo thời gian
    public RevenueResponse getThongKe(String period) {
        String revenueQuery = buildRevenueQuery(period);
        String productsSoldQuery = buildProductsSoldQuery(period);
        String completedOrdersQuery = buildCompletedOrdersQuery(period);
        String cancelledOrdersQuery = buildCancelledOrdersQuery(period);

        double totalRevenue = jdbcTemplate.queryForObject(revenueQuery, Double.class);
        int totalProductsSold = jdbcTemplate.queryForObject(productsSoldQuery, Integer.class);
        int totalCompletedOrders = jdbcTemplate.queryForObject(completedOrdersQuery, Integer.class);
        int totalCancelledOrders = jdbcTemplate.queryForObject(cancelledOrdersQuery, Integer.class);

        return new RevenueResponse(totalRevenue, totalProductsSold, totalCompletedOrders, totalCancelledOrders);
    }

    // Xây dựng câu truy vấn doanh thu theo thời gian
    private String buildRevenueQuery(String period) {
        String dateCondition = getDateCondition(period);
        return "SELECT COALESCE(SUM(hd.tong_tien), 0) " +
                "FROM hoa_don hd " +
                "WHERE hd.trang_thai = 'Hoàn thành' AND " + dateCondition;
    }



    // Xây dựng câu truy vấn số lượng sản phẩm bán được
    private String buildProductsSoldQuery(String period) {
        String dateCondition = getDateCondition(period);
        String query = "SELECT COALESCE(SUM(hdct.so_luong), 0) AS tong_san_pham_ban " +
                "FROM hoa_don_chi_tiet hdct " +
                "JOIN hoa_don hd ON hdct.id_hoa_don = hd.id " +
                "WHERE hd.trang_thai = 'Hoàn thành' AND " + dateCondition;

        System.out.println("Generated Query: " + query); // Debug SQL
        return query;
    }

    // Xây dựng câu truy vấn số đơn hàng hoàn thành
    private String buildCompletedOrdersQuery(String period) {
        String dateCondition = getDateCondition(period);
        return "SELECT COUNT(*) " +
                "FROM hoa_don hd " +
                "WHERE hd.trang_thai = 'Hoàn thành' AND " + dateCondition;
    }


    // Xây dựng câu truy vấn số đơn hàng đã hủy
    private String buildCancelledOrdersQuery(String period) {
        String dateCondition = getDateCondition(period);
        return "SELECT COUNT(*) " +
                "FROM hoa_don hd " +
                "WHERE hd.trang_thai = N'Đã hủy' AND " + dateCondition;
    }



    // Xây dựng điều kiện theo thời gian
    private String getDateCondition(String period) {
        switch (period) {
            case "TODAY":
                return "hd.ngay_tao >= CAST(GETDATE() AS DATE) AND hd.ngay_tao < DATEADD(DAY, 1, CAST(GETDATE() AS DATE))";
            case "WEEK":
                return "hd.ngay_tao >= DATEADD(DAY, - (DATEPART(WEEKDAY, GETDATE()) + @@DATEFIRST - 2) % 7, CAST(GETDATE() AS DATE)) " +
                        "AND hd.ngay_tao < DATEADD(DAY, 7 - (DATEPART(WEEKDAY, GETDATE()) + @@DATEFIRST - 2) % 7, CAST(GETDATE() AS DATE))";
            case "MONTH":
                return "hd.ngay_tao >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) " +
                        "AND hd.ngay_tao < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))";
            case "YEAR":
                return "hd.ngay_tao >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1) " +
                        "AND hd.ngay_tao < DATEADD(YEAR, 1, DATEFROMPARTS(YEAR(GETDATE()), 1, 1))";
            default:
                throw new IllegalArgumentException("Invalid period: " + period);
        }
    }



    public Object[] findCustomRevenue(String startDate, String endDate) {
        String sql = """
        SELECT 
          (SELECT COALESCE(SUM(tong_tien), 0) 
           FROM hoa_don
           WHERE ngay_tao >= CAST(? AS DATE)
             AND ngay_tao < DATEADD(DAY, 1, CAST(? AS DATE))
             AND trang_thai = 'Hoàn thành'
          ) AS totalRevenue,
          (SELECT COALESCE(SUM(so_luong), 0)
           FROM hoa_don_chi_tiet
           WHERE id_hoa_don IN (
             SELECT id FROM hoa_don
             WHERE ngay_tao >= CAST(? AS DATE)
               AND ngay_tao < DATEADD(DAY, 1, CAST(? AS DATE))
               AND trang_thai = 'Hoàn thành'
           )
          ) AS totalProductsSold,
          (SELECT COUNT(*) 
           FROM hoa_don
           WHERE ngay_tao >= CAST(? AS DATE)
             AND ngay_tao < DATEADD(DAY, 1, CAST(? AS DATE))
             AND trang_thai = 'Hoàn thành'
          ) AS totalCompletedOrders,
          (SELECT COUNT(*) 
           FROM hoa_don
           WHERE ngay_tao >= CAST(? AS DATE)
             AND ngay_tao < DATEADD(DAY, 1, CAST(? AS DATE))
             AND trang_thai = N'Đã hủy'
          ) AS totalCancelledOrders
        """;
        return jdbcTemplate.queryForObject(
                sql,
                new Object[]{ startDate, endDate, startDate, endDate, startDate, endDate, startDate, endDate },
                (rs, rowNum) -> new Object[] {
                        rs.getObject("totalRevenue"),
                        rs.getObject("totalProductsSold"),
                        rs.getObject("totalCompletedOrders"),
                        rs.getObject("totalCancelledOrders")
                }
        );
    }

}
