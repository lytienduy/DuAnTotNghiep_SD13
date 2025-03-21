package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductOutOfStockDTO {
    private String anhSanPham;   // Đường dẫn ảnh sản phẩm
    private String moTaChiTiet;  // Mô tả sản phẩm chi tiết
    private int soLuongTon;      // Số lượng tồn
    private double giaSanPham;   // Giá sản phẩm
}
