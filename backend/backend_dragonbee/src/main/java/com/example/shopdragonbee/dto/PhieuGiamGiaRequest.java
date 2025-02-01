package com.example.shopdragonbee.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PhieuGiamGiaRequest {
    private String ma;
    private String tenPhieuGiamGia;
    private String loaiPhieuGiamGia;
    private String kieuGiamGia;  // Công khai hoặc Cá nhân
    private Float giaTriGiam;
    private Float soTienToiThieu;
    private Float soTienGiamToiDa;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private Integer soLuong;
    private String moTa;
    private List<Integer> khachHangIds;  // Danh sách ID khách hàng được chọn
}
