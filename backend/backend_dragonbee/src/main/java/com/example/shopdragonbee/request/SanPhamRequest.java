package com.example.shopdragonbee.request;

import lombok.Data;

@Data
public class SanPhamRequest {

    private String ma;
    private String tenSanPham;
    private String moTa;
    private String trangThai;
    private String nguoiTao;
    private SanPhamChiTietRequest sanPhamChiTiet;
}
