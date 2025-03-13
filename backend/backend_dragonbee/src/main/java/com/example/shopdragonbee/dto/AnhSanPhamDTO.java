package com.example.shopdragonbee.dto;

import lombok.Data;

@Data
public class AnhSanPhamDTO {
    private Integer id;
    private String ma;
    private String anhUrl;
    private String moTa;
    private String trangThai= "Hoạt động";
    private Integer sanPhamChiTietId;
}
