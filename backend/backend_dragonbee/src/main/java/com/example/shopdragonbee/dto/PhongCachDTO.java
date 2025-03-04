package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhongCachDTO {
    private Integer id;
    private String ma;
    private String tenPhongCach;
    private String moTa;
    private String trangThai;
}
