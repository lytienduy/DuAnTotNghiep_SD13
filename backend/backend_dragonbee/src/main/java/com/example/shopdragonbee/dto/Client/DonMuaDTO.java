package com.example.shopdragonbee.dto.Client;

import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.entity.KieuDang;
import lombok.*;

import java.util.List;

public class DonMuaDTO {
    private String abc;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HoaDonClient {
        private Integer id;
        private String maHoaDon;
        private String trangThai;
        private List<SanPham> sanPhams;
        private Float tongTienThanhToan;
        private List<HoaDonChiTietResponseDTO.ThanhToanHoaDonDTO> listThanhToanHoaDon;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SanPham {
        private Integer id;
        private Integer idSanPham;
        private String tenSanPham;
        private String mauSac;
        private Integer soLuong;
        private Double gia;
        private String size;
        private String hinhAnh;
    }
}
