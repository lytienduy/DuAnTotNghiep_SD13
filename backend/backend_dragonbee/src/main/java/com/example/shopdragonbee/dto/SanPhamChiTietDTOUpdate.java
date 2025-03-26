package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SanPhamChiTietDTOUpdate {
    private Integer id;
    private String ma;
    private Integer soLuong = 0;
    private Double gia = 0.0;
    private String trangThai;
    private String moTa;

    // Các trường đối tượng thay vì ID
    private DanhMucDTO danhMuc;
    private ThuongHieuDTO thuongHieu;
    private PhongCachDTO phongCach;
    private ChatLieuDTO chatLieu;
    private MauSacDTO mauSac;
    private SizeDTO size;
    private KieuDangDTO kieuDang;
    private KieuDaiQuanDTO kieuDaiQuan;
    private XuatXuDTO xuatXu;

    private List<String> anhUrls; // Danh sách ảnh
}
