package com.example.shopdragonbee.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamChiTietUpdateDTO {
    private Integer id;
    private Integer danhMucId;
    private Integer thuongHieuId;
    private Integer phongCachId;
    private Integer chatLieuId;
    private Integer kieuDangId;
    private Integer kieuDaiQuanId;
    private Integer xuatXuId;
    private String moTa;
    private Integer mauSacId;
    private Integer sizeId;
    private Integer soLuong;
    private Double gia;


}
