package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueGrowthDTO {
    private Double dayRevenue;
    private Double dayGrowth;
    private Double weekRevenue;
    private Double weekGrowth;
    private Double monthRevenue;
    private Double monthGrowth;
    private Double yearRevenue;
    private Double yearGrowth;
}
