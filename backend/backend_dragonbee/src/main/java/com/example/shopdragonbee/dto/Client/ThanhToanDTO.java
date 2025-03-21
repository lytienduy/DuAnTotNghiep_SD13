package com.example.shopdragonbee.dto.Client;

import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThanhToanDTO {
    private String pgg; // Mã giảm giá
    private String tenNguoiNhan;
    private String sdtNguoiNhan;
    private String diaChiNhanHang;
    private String tongTienPhaiTra;
    private String phiShip;
    private String ghiChu;
    private List<SPCTDTO.SanPhamCart> danhSachThanhToan; // Mảng JSON
}
