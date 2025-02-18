package com.example.shopdragonbee.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SanPhamChiTietDTO {
    private Integer id;
    private String ma;
    private String sanPham; // Tên sản phẩm
    private String danhMuc; // Danh mục
    private String thuongHieu; // Thương hiệu
    private String phongCach; // Phong cách
    private String chatLieu; // Chất liệu
    private String mauSac; // Màu sắc
    private String size; // Kích cỡ
    private String kieuDang; // Kiểu dáng
    private String kieuDaiQuan; // Kiểu đai quần
    private String xuatXu; // Xuất xứ
    private Integer soLuong; // Số lượng
    private Double gia; // Giá
    private String anh; // Ảnh
    private String trangThai; // Trạng thái
    private String moTa;
}
