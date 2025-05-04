package com.example.shopdragonbee.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String tenKhachHang;
    private String email;
    private String matKhau;
    private String xacNhanMatKhau;
}
