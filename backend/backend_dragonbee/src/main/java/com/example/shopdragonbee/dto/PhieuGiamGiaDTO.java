package com.example.shopdragonbee.dto;

import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PhieuGiamGiaDTO {

    private Integer id;
    private String ma;
    private String tenPhieuGiamGia;
    private String loaiPhieuGiamGia;
    private String kieuGiamGia;
    private Float giaTriGiam;
    private Float soTienToiThieu;
    private Float soTienGiamToiDa;
    private Integer soLuong;
    private LocalDateTime ngayTao;
    private String moTa;
    private String trangThai;
    private List<KhachHang> khachHangs;  // Chứa danh sách khách hàng nếu là phiếu cá nhân

    public PhieuGiamGiaDTO(PhieuGiamGia phieuGiamGia) {
        this.id = phieuGiamGia.getId();
        this.ma = phieuGiamGia.getMa();
        this.tenPhieuGiamGia = phieuGiamGia.getTenPhieuGiamGia();
        this.loaiPhieuGiamGia = phieuGiamGia.getLoaiPhieuGiamGia();
        this.kieuGiamGia = phieuGiamGia.getKieuGiamGia();
        this.giaTriGiam = phieuGiamGia.getGiaTriGiam();
        this.soTienToiThieu = phieuGiamGia.getSoTienToiThieu();
        this.soTienGiamToiDa = phieuGiamGia.getSoTienGiamToiDa();
        this.soLuong = phieuGiamGia.getSoLuong();
        this.ngayTao = phieuGiamGia.getNgayTao();
        this.moTa = phieuGiamGia.getMoTa();
        this.trangThai = phieuGiamGia.getTrangThai();
    }
}
