package com.example.shopdragonbee.respone;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class KieuDangRespone {

    private Integer id;

    private String ma;

    private String tenKieuDang;

    private String moTa;

    private String trangThai;
}
