package com.example.shopdragonbee.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Getter
@Setter
public class NhanVienRequestDTO {
    private String ma;
    private String tenNhanVien;
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String sdt;
    private String email;
//    private String diaChi;
    private MultipartFile anh; // Thay đổi từ String sang MultipartFile
    private String cccd;
    private String trangThai;
    private String nguoiTao;
    private Integer idTaiKhoan;
    private String matKhau; // Thêm mật khẩu
    private String tenNguoiDung;


    // Thêm các trường địa chỉ chi tiết
    private String tinhThanh;
    private String quanHuyen;
    private String xaPhuong;
    private String soNha;

    public String getFullAddress() {
        return String.join(", ", soNha, xaPhuong, quanHuyen, tinhThanh);
    }



}
