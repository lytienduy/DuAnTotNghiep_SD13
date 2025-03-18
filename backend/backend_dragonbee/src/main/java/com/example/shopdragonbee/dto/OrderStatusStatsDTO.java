package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusStatsDTO {
    private String trangThai;  // Tên trạng thái
    private int soLuong;      // Số lượng đơn
}