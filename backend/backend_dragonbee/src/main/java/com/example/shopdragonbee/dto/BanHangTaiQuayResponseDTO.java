package com.example.shopdragonbee.dto;

import com.example.shopdragonbee.entity.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BanHangTaiQuayResponseDTO {
    private String abc;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SanPhamHienThiTrongThemBanHangTaiQuay {
        private Integer id;
        private String ma;
        private List<String> hinhAnh;
        private String tenMauSize;
        private String chatLieu;
        private String danhMuc;
        private String thuongHieuXuatXu;
        private String kieuDang;
        private String phongCach;
        private Double gia;
        private Integer soLuong;
        private String trangThai;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LuuListCacBoLocThemSanPham {
        private List<DanhMuc> listDanhMuc;
        private List<MauSac> listMauSac;
        private List<ChatLieu> listChatLieu;
        private List<Size> listSize;
        private List<KieuDang> listKieuDang;
        private List<ThuongHieu> listThuongHieu;
        private List<PhongCach> listPhongCach;
    }
}
