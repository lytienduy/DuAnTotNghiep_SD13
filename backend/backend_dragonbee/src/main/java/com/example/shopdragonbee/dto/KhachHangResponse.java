package com.example.shopdragonbee.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class KhachHangResponse {
    private String tenKhachHang;
    private String sdt;
    private String email;
    private LocalDate ngaySinh;
}
