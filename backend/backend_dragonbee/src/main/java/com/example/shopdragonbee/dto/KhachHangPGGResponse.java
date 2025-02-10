package com.example.shopdragonbee.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class KhachHangPGGResponse {
    private Integer id;
    private String tenKhachHang;
    private String sdt;
    private String email;
    private LocalDate ngaySinh;
}
