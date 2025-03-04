package com.example.shopdragonbee.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoaDonResponseDTO {

    private Integer id;
    private String ma;
    private String maKhachHang; // Kết hợp tên và số điện thoại
    private String tenKhachHang;
    private String sdtKhachHang;
    private String loaiDon;
    private LocalDateTime ngayTao;
    private String trangThai;
    private Float tongTien;

}
