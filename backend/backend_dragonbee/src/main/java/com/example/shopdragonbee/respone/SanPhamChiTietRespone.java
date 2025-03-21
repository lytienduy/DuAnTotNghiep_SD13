package com.example.shopdragonbee.respone;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.List;


@Data
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

    private List<String> anhUrls;

    public SanPhamChiTietRespone(Integer id, String ma, String tenSanPham,
                                 String danhMuc, String thuongHieu, String phongCach,
                                 String chatLieu, String mauSac, String size,
                                 String kieuDang, String kieuDaiQuan, String xuatXu,
                                 Integer soLuong, Double gia, String trangThai) {
        this.id = id;
        this.ma = ma;
        this.tenSanPham = tenSanPham;
        this.danhMuc = danhMuc;
        this.thuongHieu = thuongHieu;
        this.phongCach = phongCach;
        this.chatLieu = chatLieu;
        this.mauSac = mauSac;
        this.size = size;
        this.kieuDang = kieuDang;
        this.kieuDaiQuan = kieuDaiQuan;
        this.xuatXu = xuatXu;
        this.soLuong = soLuong;
        this.gia = gia;
        this.trangThai = trangThai;
    }

}
