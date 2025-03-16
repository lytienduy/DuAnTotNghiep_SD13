package com.example.shopdragonbee.dto;

import com.example.shopdragonbee.entity.TaiKhoan;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Data
public class KhachHangAddBTQDTO {

    private String tenKhachHang;
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String sdt;
    private String email;
    private DiaChiBTQDTO diaChi;  // DTO chứa thông tin địa chỉ của khách hàng
    private TaiKhoan taiKhoan;  // Tùy thuộc vào cách bạn tạo tài khoản, nếu có

}
