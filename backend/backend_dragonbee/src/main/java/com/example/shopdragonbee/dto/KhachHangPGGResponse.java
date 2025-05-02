package com.example.shopdragonbee.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class KhachHangPGGResponse {
    private Integer id;
    private String tenKhachHang;
    private String sdt;
    private String email;
    private LocalDate ngaySinh;
    private Double chiTieuThang;

    // Constructor với tham số phù hợp nếu Spring không nhận diện đúng
    public KhachHangPGGResponse(Integer id, String tenKhachHang, String sdt, String email, LocalDate ngaySinh) {
        this.id = id;
        this.tenKhachHang = tenKhachHang;
        this.sdt = sdt;
        this.email = email;
        this.ngaySinh = ngaySinh;
    }
}
