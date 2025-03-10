package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DanhMucDTO {
    private Integer id;
    private String ma;
    private String tenDanhMuc;
    private String moTa;
    private String trangThai;
}
