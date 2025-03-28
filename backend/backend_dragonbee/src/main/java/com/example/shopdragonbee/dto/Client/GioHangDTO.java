package com.example.shopdragonbee.dto.Client;

import lombok.*;

import java.util.List;

public class GioHangDTO {
    private String abc;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DuLieuDataBodyTrongGioHang {
        private Integer idKhachHang;
        private List<SPCTDTO.SanPhamCart> cart;
    }
}
