package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomRevenueDTO {
    private BigDecimal totalRevenue;         // Tổng doanh thu
    private int totalProductsSold;             // Tổng số sản phẩm bán được
    private int totalCompletedOrders;          // Tổng số đơn hàng hoàn thành
    private int totalCancelledOrders;          // Tổng số đơn hàng hủy
}