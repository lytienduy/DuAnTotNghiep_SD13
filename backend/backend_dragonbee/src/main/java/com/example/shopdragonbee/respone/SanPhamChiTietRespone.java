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
    private Integer soLuong;
    private String moTa;
    private String trangThai;
    private Double gia;
    private String maSanPham;
    private String tenSanPham;
    private String mauSac;
    private String chatLieu;
    private String danhMuc;
    private String size;
    private String thuongHieu;
    private String kieuDang;
    private String kieuDaiQuan;
    private String xuatXu;
    private String phongCach;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private String nguoiTao;
    private String nguoiSua;
}
