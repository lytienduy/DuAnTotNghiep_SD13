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
    private String nguoiNhanHang; // Kết hợp tên và số điện thoại
    private String loaiDon;
    private LocalDateTime ngayTao;
    private String trangThai;
    private Float tongTien;

}
