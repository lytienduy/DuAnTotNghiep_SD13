package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.RevenueGrowthDTO;
import com.example.shopdragonbee.repository.RevenueGrowthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RevenueGrowthService {

    private final RevenueGrowthRepository repository;

    public RevenueGrowthDTO getRevenueGrowth() {
        RevenueGrowthDTO dto = new RevenueGrowthDTO();

        // Doanh thu và tốc độ tăng trưởng theo ngày
        Object resultDay = repository.getDayGrowth();
        Object[] dayData = (Object[]) resultDay;
        dto.setDayRevenue(((Number) dayData[0]).doubleValue());
        dto.setDayGrowth(((Number) dayData[1]).doubleValue());

        // Tuần
        Object resultWeek = repository.getWeekGrowth();
        Object[] weekData = (Object[]) resultWeek;
        dto.setWeekRevenue(((Number) weekData[0]).doubleValue());
        dto.setWeekGrowth(((Number) weekData[1]).doubleValue());

        // Tháng
        Object resultMonth = repository.getMonthGrowth();
        Object[] monthData = (Object[]) resultMonth;
        dto.setMonthRevenue(((Number) monthData[0]).doubleValue());
        dto.setMonthGrowth(((Number) monthData[1]).doubleValue());

        // Năm
        Object resultYear = repository.getYearGrowth();
        Object[] yearData = (Object[]) resultYear;
        dto.setYearRevenue(((Number) yearData[0]).doubleValue());
        dto.setYearGrowth(((Number) yearData[1]).doubleValue());

        return dto;
    }
}
