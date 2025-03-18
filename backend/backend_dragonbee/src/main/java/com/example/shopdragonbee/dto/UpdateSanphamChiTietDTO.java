package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateSanphamChiTietDTO {
    private Integer id;         // ID của sản phẩm chi tiết cần sửa
    private Integer soLuong;    // Số lượng mới
    private Double gia;         // Giá mới
}

