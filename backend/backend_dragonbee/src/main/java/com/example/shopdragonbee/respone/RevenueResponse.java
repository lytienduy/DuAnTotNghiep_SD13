package com.example.shopdragonbee.respone;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RevenueResponse {
    private double totalRevenue;
    private int totalProductsSold;
    private int totalCompletedOrders;
    private int totalCancelledOrders;
}
