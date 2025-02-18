package com.example.shopdragonbee.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SanPhamDTO {
    private String tenSanPham;
    private String danhMuc;
    private String thuongHieu;
    private String phongCach;
    private String xuatXu;
    private String chatLieu;
    private String kieuDang;
    private String kieuDaiQuan;
    private String trangThai;
    private List<SanPhamChiTietDTO> sanPhamChiTietList;
}
