package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KhachHangDto {
    private String ma;
    private String tenKhachHang;
    private String email;
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String sdt;
    private String trangThai;
    private List<DiaChiDto> diaChiDtos;
}
