package com.example.shopdragonbee.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SanPhamChiTietDTO {
    private Integer id;
    private String ma;
    private Integer sanPhamId; // ID sản phẩm cha
    private Integer danhMucId;
    private Integer thuongHieuId;
    private Integer phongCachId;
    private Integer chatLieuId;
    private Integer mauSacId;
    private Integer sizeId;
    private Integer kieuDangId;
    private Integer kieuDaiQuanId;
    private Integer xuatXuId;
    private Integer soLuong = 0;
    private Double gia = 0.0;
    private String trangThai;
    private String moTa;
    private List<String> anhUrls; // Thêm trường cho danh sách ảnh

}
