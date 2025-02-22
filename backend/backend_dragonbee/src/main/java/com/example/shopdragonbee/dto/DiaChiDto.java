package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DiaChiDto {
    private Integer id;
    private String soNha;
    private String duong;
    private String xa;
    private String huyen;
    private String thanhPho;
    private String moTa;
    private String trangThai;
    private Boolean macDinh;
}
