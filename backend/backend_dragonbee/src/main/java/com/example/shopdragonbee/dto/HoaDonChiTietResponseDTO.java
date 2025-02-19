package com.example.shopdragonbee.dto;


import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoaDonChiTietResponseDTO {
    private String abc;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HoaDonDTO {
        private Integer id;
        private String ma;
        private String loaiHoaDon; // Kết hợp tên và số điện thoại
        private String ghiChu;
        private String tenNguoiNhanHang;
        private String sdtNguoiNhanHang;
        private String emailNguoiNhanHang;
        private String diaChiNguoiNhanHang;
        private String maKhachHang;
        private String tenKhachHang;
        private String sdtKhachHang;
        private Float tongTienHang;
        private Float phiVanChuyen;
        private String maVoucher;
        private String trangThai;
        private List<ThanhToanHoaDonDTO> listThanhToanHoaDon;

        private List<DanhSachSanPhamDTO> listDanhSachSanPham;

        private List<LichSuHoaDonDTO> listLichSuHoaDon;
    }

    //    private List<ThanhToanHoaDon> listThanhToanHoaDon;
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ThanhToanHoaDonDTO {
        private Integer id;
        private Float soTien;
        private LocalDateTime ngayTao;
        private String phuongThuc;
        private String nhanVienXacNhan;
        private String ghiChu;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DanhSachSanPhamDTO {
        private Integer id;
        private List<String> hinhAnh;
        private String tenMauSize;
        private String maSanPhamChiTiet;
        private Float donGia;
        private Integer soLuong;
        private Float soTien;

    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LichSuHoaDonDTO {
        private Integer id;
        private String hanhDong;
        private String moTa;
        private LocalDateTime ngay;
        private String nguoiTao;
    }

}
