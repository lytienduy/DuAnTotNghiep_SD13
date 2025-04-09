package com.example.shopdragonbee.dto;

import lombok.Data;

@Data
public class SanPhamChiTietSearchDTO {
    private String tenSanPham;
    private Integer danhMucId;
    private Integer thuongHieuId;
    private Integer phongCachId;
    private Integer chatLieuId;
    private Integer kieuDangId;
    private Integer kieuDaiQuanId;
    private Integer xuatXuId;
    private Integer mauSacId;
    private Integer sizeId;
    private Double giaMin;
    private Double giaMax;
}
