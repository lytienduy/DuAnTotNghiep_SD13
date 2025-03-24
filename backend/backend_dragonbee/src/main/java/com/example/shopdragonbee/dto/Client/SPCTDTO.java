package com.example.shopdragonbee.dto.Client;

import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.entity.KieuDang;
import com.example.shopdragonbee.entity.MauSac;
import lombok.*;

import java.util.List;

public class SPCTDTO {
    private String abc;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SanPhamChiTietClient {
        private String ten;
        private List<SPCTDTO.MauSacAndHinhAnhAndSize> listHinhAnhAndMauSacAndSize;
        private KieuDang kieuDang;
        private ChatLieu chatLieu;
        private String moTa;
        private Double gia;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MauSacAndHinhAnhAndSize {
        private List<String> listAnh;
        private MauSac mauSac;
        private List<SizeCuaPhong> listSize;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SizeCuaPhong {
        private Integer idSPCT;
        private String tenSPCT;
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
    public static class SanPhamCart {
        private Integer idSPCT;
        private String anhSPCT;
        private String tenSPCT;
        private String tenSize;
        private Double gia;
        private Integer quantity;
    }
}
