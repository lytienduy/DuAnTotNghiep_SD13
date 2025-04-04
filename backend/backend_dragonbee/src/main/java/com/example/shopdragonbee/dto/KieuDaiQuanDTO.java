package com.example.shopdragonbee.dto;

import jakarta.persistence.Access;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KieuDaiQuanDTO {

    private Integer id;
    private String ma;
    private String tenKieuDaiQuan;
    private String moTa;
    private String trangThai;

    public KieuDaiQuanDTO(Integer id, String tenKieuDaiQuan) {
        this.id = id;
        this.tenKieuDaiQuan = tenKieuDaiQuan;
    }
}
