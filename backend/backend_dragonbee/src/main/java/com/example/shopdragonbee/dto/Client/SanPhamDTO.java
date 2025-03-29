package com.example.shopdragonbee.dto.Client;

import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.entity.KieuDang;
import com.example.shopdragonbee.entity.MauSac;
import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SanPhamDTO {
    private String abc;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SanPhamClient {
        private Integer id;
        private String ten;
        private List<SanPhamDTO.MauSacAndHinhAnhAndSize> listHinhAnhAndMauSacAndSize;
        private Double gia;
        private Boolean isNew;
//        private String trangThai;
    }
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MauSacAndHinhAnhAndSize {
        private List<String> listAnh;
        private MauSac mauSac;
        private List<SanPhamDTO.SizeCuaPhong> listSize;
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
}
