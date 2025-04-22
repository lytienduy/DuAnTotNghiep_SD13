package com.example.shopdragonbee.respone;

import com.example.shopdragonbee.dto.ChatLieuDTO;
import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.KieuDaiQuanDTO;
import com.example.shopdragonbee.dto.KieuDangDTO;
import com.example.shopdragonbee.dto.MauSacDTO;
import com.example.shopdragonbee.dto.PhongCachDTO;
import com.example.shopdragonbee.dto.SanPhamDTO;
import com.example.shopdragonbee.dto.SizeDTO;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.dto.XuatXuDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Data
@Builder
@AllArgsConstructor
@Getter
@Setter
public class SanPhamChiTietRespone {
    private Integer id;
    private String ma;
    private SanPhamDTO sanPham;

    private DanhMucDTO danhMuc;
    private ThuongHieuDTO thuongHieu;
    private PhongCachDTO phongCach;
    private ChatLieuDTO chatLieu;
    private MauSacDTO mauSac;
    private SizeDTO size;
    private KieuDangDTO kieuDang;
    private KieuDaiQuanDTO kieuDaiQuan;
    private XuatXuDTO xuatXu;

    private Integer soLuong;
    private Double gia;
    private String trangThai;

    private List<String> anhUrls;
}
