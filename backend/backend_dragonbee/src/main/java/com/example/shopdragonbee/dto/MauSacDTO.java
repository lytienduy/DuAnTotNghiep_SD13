package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MauSacDTO {

    private Integer id;
    private String ma;
    private String tenMauSac;
    private String moTa;
    private String trangThai;
}
