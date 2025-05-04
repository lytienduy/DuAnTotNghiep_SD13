package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SanPhamSoLuongDTO {
    private Integer id;
    private String ma;
    private String tenSanPham;
    private Long tongSoLuong;
}
