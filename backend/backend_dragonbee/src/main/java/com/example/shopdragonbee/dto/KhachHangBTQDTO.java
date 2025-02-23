package com.example.shopdragonbee.dto;

import com.example.shopdragonbee.entity.DiaChi;
import com.example.shopdragonbee.entity.KhachHang;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KhachHangBTQDTO {
    private Integer id;
    private String ma;
    private String tenKhachHang;
    private String sdt;
    private List<DiaChi> diaChis;

    public KhachHangBTQDTO(KhachHang khachHang) {
        this.id = khachHang.getId();
        this.ma = khachHang.getMa();
        this.tenKhachHang = khachHang.getTenKhachHang();
        this.sdt = khachHang.getSdt();

        // Ưu tiên địa chỉ mặc định
        this.diaChis = khachHang.getDiaChis().stream()
                .sorted((diaChi1, diaChi2) -> diaChi2.getMacDinh().compareTo(diaChi1.getMacDinh()))
                .collect(Collectors.toList());
    }
}
