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
    public static class SanPhamClient {
        private Integer id;
        private String ten;
        private List<HomeDTO.MauSacAndHinhAnhAndSize> listHinhAnhAndMauSacAndSize;
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
        private List<HomeDTO.SizeCuaPhong> listSize;
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
