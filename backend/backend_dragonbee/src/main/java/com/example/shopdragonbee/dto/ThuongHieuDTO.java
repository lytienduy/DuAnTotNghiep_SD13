package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThuongHieuDTO {

    private Integer id;
    private String ma;
    private String tenThuongHieu;
    private String moTa;
    private String trangThai;
}
