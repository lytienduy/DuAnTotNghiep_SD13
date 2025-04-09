package com.example.shopdragonbee.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SanPhamDTO {

    private Integer id;
    private String ma;
    private Long tongSoLuong;
    private String tenSanPham;
    private LocalDateTime ngayTao;
    private String trangThai;

    // Constructor phù hợp với query trong Repository
    public SanPhamDTO(Integer id, String ma, String tenSanPham, Long tongSoLuong, LocalDateTime ngayTao, String trangThai) {
        this.id = id;
        this.ma = ma;
        this.tongSoLuong = tongSoLuong;
        this.tenSanPham = tenSanPham;
        this.ngayTao = ngayTao;
        this.trangThai = trangThai;
    }

    public SanPhamDTO(Integer id, String tenSanPham) {
        this.id = id;
        this.tenSanPham = tenSanPham;
    }
}
