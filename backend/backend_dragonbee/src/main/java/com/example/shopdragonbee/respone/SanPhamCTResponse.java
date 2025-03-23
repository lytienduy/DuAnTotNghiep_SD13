package com.example.shopdragonbee.respone;

public class SanPhamCTResponse {
    private String ma;
    private String moTa;
    private int soLuong;
    private double gia;

    public SanPhamCTResponse(String ma, String moTa, int soLuong, double gia) {
        this.ma = ma;
        this.moTa = moTa;
        this.soLuong = soLuong;
        this.gia = gia;
    }

    // Getter và Setter
    public String getMa() { return ma; }
    public void setMa(String ma) { this.ma = ma; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public int getSoLuong() { return soLuong; }
    public void setSoLuong(int soLuong) { this.soLuong = soLuong; }

    public double getGia() { return gia; }
    public void setGia(double gia) { this.gia = gia; }
}
