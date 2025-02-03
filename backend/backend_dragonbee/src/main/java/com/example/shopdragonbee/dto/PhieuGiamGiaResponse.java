package com.example.shopdragonbee.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PhieuGiamGiaResponse {
    private String ma;
    private String tenPhieuGiamGia;
    private String kieuGiamGia;
    private String loaiPhieuGiamGia;
    private double giaTriGiam;  // Thay vì String, để xử lý số chính xác
    private int soLuong;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private String trangThai;
    private Double giaTriGiamToiDa;
    private double soTienToiThieu;

    // Danh sách khách hàng được chọn nếu kieuGiamGia là "Cá nhân"
    private List<Integer> khachHangIds;

    // Phương thức bổ sung để trả về chuỗi hiển thị giá trị giảm
    @JsonProperty("formattedGiaTriGiam")
    public String getFormattedGiaTriGiam() {
        if ("Phần trăm".equalsIgnoreCase(loaiPhieuGiamGia)) {
            return giaTriGiam + "%";
        } else if ("Cố định".equalsIgnoreCase(loaiPhieuGiamGia)) {
            return giaTriGiam + " VNĐ";
        } else {
            return String.valueOf(giaTriGiam);
        }
    }

    // Constructor phù hợp với câu truy vấn
    public PhieuGiamGiaResponse(String ma, String tenPhieuGiamGia, String kieuGiamGia, String loaiPhieuGiamGia,
                                double giaTriGiam, int soLuong, LocalDateTime ngayBatDau, LocalDateTime ngayKetThuc,
                                String trangThai, double giaTriGiamToiDa, double soTienToiThieu) {
        this.ma = ma;
        this.tenPhieuGiamGia = tenPhieuGiamGia;
        this.kieuGiamGia = kieuGiamGia;
        this.loaiPhieuGiamGia = loaiPhieuGiamGia;
        this.giaTriGiam = giaTriGiam;
        this.soLuong = soLuong;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.trangThai = trangThai;
        this.giaTriGiamToiDa = giaTriGiamToiDa;
        this.soTienToiThieu = soTienToiThieu;
    }

    public PhieuGiamGiaResponse(String ma, String tenPhieuGiamGia, String kieuGiamGia, String loaiPhieuGiamGia, double giaTriGiam, int soLuong, LocalDateTime ngayBatDau, LocalDateTime ngayKetThuc, String trangThai) {
        this.ma = ma;
        this.tenPhieuGiamGia = tenPhieuGiamGia;
        this.kieuGiamGia = kieuGiamGia;
        this.loaiPhieuGiamGia = loaiPhieuGiamGia;
        this.giaTriGiam = giaTriGiam;
        this.soLuong = soLuong;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.trangThai = trangThai;
    }
}
