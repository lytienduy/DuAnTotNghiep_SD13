package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KieuDangDTO {

    private Integer id;
    private String ma;
    private String tenKieuDang;
    private String moTa;
    private String trangThai;

    public KieuDangDTO(Integer id, String tenKieuDang) {
        this.id = id;
        this.tenKieuDang = tenKieuDang;
    }
}
