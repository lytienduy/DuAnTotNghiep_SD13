package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnhSanPhamDTO {
    private Integer id;
    private String ma;
    private String anhUrl;
    private String moTa;
    private String trangThai= "Hoạt động";
    private Integer sanPhamChiTietId;
}
