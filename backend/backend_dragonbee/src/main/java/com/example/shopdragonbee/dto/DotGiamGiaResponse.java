package com.example.shopdragonbee.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DotGiamGiaResponse {

    private Integer id;
    private String maDotGiamGia;
    private String tenDotGiamGia;
    private Double giaTriGiam;
    private String loaiDotGiamGia;
    private String trangThai;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
}
