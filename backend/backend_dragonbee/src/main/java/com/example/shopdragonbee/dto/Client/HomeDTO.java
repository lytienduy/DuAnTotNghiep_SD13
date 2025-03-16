package com.example.shopdragonbee.dto.Client;

import com.example.shopdragonbee.entity.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeDTO {
    private String abc;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SanPhamHienThiTrangHomeClient {
        private Integer id;
        private String ma;
        private String ten;
        private List<String> hinhAnh;
        private Double gia;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SanPhamHienThiTrangSanPhamClient {
        private Integer id;
        private String ma;
        private String ten;
        private List<String> hinhAnh;
        private List<String> listMauSac;
        private Double gia;

    }
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SizeCuaPhong {
        private Integer id;
        private String maSize;
        private String tenSize;
        private Integer soLuong;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListSanPhamChiTietClient {
        private List<String> hinhAnh;
        private MauSac mauSac;
        private List<SizeCuaPhong> listSize;
        private String moTa;
//        private String trangThai;
    }


}
