package com.example.shopdragonbee.respone;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SanPhamChiTietRespone {
    private Integer id;
    private String ma;
    private String tenSanPham;
    private String danhMuc;
    private String thuongHieu;
    private String phongCach;
    private String chatLieu;
    private String mauSac;
    private String size;
    private String kieuDang;
    private String kieuDaiQuan;
    private String xuatXu;
    private Integer soLuong;
    private Double gia;
    private String trangThai;

    // Getter và Setter
}
