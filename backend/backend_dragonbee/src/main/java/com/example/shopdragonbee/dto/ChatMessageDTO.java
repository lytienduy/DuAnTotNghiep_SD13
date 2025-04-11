package com.example.shopdragonbee.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatMessageDTO {
    private Integer idKhachHang;
    private Integer idNhanVien;
    private String tenNhanVien;
    private Boolean guiTuNhanVien;
    private String noiDung;
    private LocalDateTime thoiGian;
}

