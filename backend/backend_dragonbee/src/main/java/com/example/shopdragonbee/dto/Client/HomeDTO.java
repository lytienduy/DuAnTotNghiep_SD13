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
    public static class SanPhamChiTietClient {
        private Integer id;
        private String ma;
        private List<String> hinhAnh;
        private String mauSac;
        private String size;
        private Integer soLuong;
        private String trangThai;
    }
}
