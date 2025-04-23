package com.example.shopdragonbee.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageRequestDTO {
    private Integer idKhachHang;
    private Integer idNhanVien;
    private Boolean guiTuNhanVien;
    private String noiDung;
}

