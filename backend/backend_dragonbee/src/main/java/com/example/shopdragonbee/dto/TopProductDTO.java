package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopProductDTO {
    private String imageUrls;  // Danh sách ảnh
    private String description; // Mô tả sản phẩm
    private int totalSold; // Số lượng bán
    private BigDecimal price; // Giá sản phẩm
}

