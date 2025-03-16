package com.example.shopdragonbee.service;

import com.example.shopdragonbee.respone.RevenueResponse;
import com.example.shopdragonbee.repository.ThongKeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ThongKeService {

    private final ThongKeRepository thongKeRepository;

    // Thống kê cho hôm nay
    public RevenueResponse getThongKeHomNay() {
        return thongKeRepository.getThongKe("TODAY");
    }

    // Thống kê cho tuần này
    public RevenueResponse getThongKeTuanNay() {
        return thongKeRepository.getThongKe("WEEK");
    }

    // Thống kê cho tháng này
    public RevenueResponse getThongKeThangNay() {
        return thongKeRepository.getThongKe("MONTH");
    }

    // Thống kê cho năm nay
    public RevenueResponse getThongKeNamNay() {
        return thongKeRepository.getThongKe("YEAR");
    }

    //Thống kê doanh thu tùy chỉnh
    public Map<String, Object> getCustomRevenue(String startDate, String endDate) {
        Object[] result = thongKeRepository.findCustomRevenue(startDate, endDate);
        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", result[0]);
        response.put("totalProductsSold", result[1]);
        response.put("totalCompletedOrders", result[2]);
        response.put("totalCancelledOrders", result[3]);
        return response;
    }
}
