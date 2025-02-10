package com.example.shopdragonbee.respone;

import java.time.LocalDateTime;

public class SanPhamRespone {
    private Integer id;
    private String ma;
    private String tenSanPham;
    private Long tongSoLuong; // Tổng số lượng sản phẩm
    private LocalDateTime ngayTao;
    private String trangThai;

    public SanPhamRespone(Integer id, String ma, String tenSanPham, Long tongSoLuong, LocalDateTime ngayTao, String trangThai) {
        this.id = id;
        this.ma = ma;
        this.tenSanPham = tenSanPham;
        this.tongSoLuong = tongSoLuong;
        this.ngayTao = ngayTao;
        this.trangThai = trangThai;
    }

    // Getters & Setters
    public Integer getId() { return id; }
    public String getMa() { return ma; }
    public String getTenSanPham() { return tenSanPham; }
    public Long getTongSoLuong() { return tongSoLuong; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public String getTrangThai() { return trangThai; }
}
