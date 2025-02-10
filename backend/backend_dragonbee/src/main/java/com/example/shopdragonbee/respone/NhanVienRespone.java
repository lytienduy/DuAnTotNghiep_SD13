package com.example.shopdragonbee.respone;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NhanVienRespone {

    private Integer id;

    private String ma;

    private String tenNhanVien;

    private LocalDate ngaySinh;

    private String gioiTinh;

    private String sdt;

    private String email;

    private String diaChi;

    private String trangThai;
}
