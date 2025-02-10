package com.example.shopdragonbee.request;

import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.entity.KieuDaiQuan;
import com.example.shopdragonbee.entity.KieuDang;
import com.example.shopdragonbee.entity.MauSac;
import com.example.shopdragonbee.entity.PhongCach;
import com.example.shopdragonbee.entity.Size;
import com.example.shopdragonbee.entity.ThuongHieu;
import com.example.shopdragonbee.entity.XuatXu;
import lombok.Data;

@Data
public class SanPhamChiTietRequest {

    private String ma;
    private Integer soLuong;
    private String moTa;
    private String trangThai;
    private Double gia;
    private MauSac mauSac;
    private ChatLieu chatLieu;
    private DanhMuc danhMuc;
    private Size size;
    private ThuongHieu thuongHieu;
    private KieuDang kieuDang;
    private KieuDaiQuan kieuDaiQuan;
    private XuatXu xuatXu;
    private PhongCach phongCach;
    private String nguoiTao;
}
