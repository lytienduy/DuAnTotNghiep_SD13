package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SanPhamChiTietResponse {
    private Integer id;
    private String tenSanPhamChiTiet;
    private String danhMuc;
    private String thuongHieu;
    private String mauSac;
    private String kieuDang;
    private Integer soLuong;
}
