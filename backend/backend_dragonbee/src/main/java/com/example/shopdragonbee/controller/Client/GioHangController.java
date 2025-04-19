package com.example.shopdragonbee.controller.Client;

import com.example.shopdragonbee.dto.Client.GioHangDTO;
import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.service.Client.GioHangService;
import com.example.shopdragonbee.service.Client.SanPhamChiTietClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/gioHang")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class GioHangController {

    @Autowired
    private GioHangService gioHangService;

    @PostMapping("/getListDanhSachCapNhatSoLuongSanPhamGioHang")
    public List<SPCTDTO.SanPhamCart> getListDanhSachCapNhatSoLuongSanPhamGioHang(@RequestBody GioHangDTO.DuLieuDataBodyTrongGioHang requestData) {

        return gioHangService.getListDanhSachCapNhatSoLuongSanPhamGioHang(requestData.getIdKhachHang(), requestData.getCart());
    }

    @PostMapping("/getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang")
    public List<SPCTDTO.SanPhamCart> getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang(@RequestBody GioHangDTO.DuLieuDataBodyTrongGioHang requestData) {
        return gioHangService.getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang(requestData.getIdKhachHang(), requestData.getCart());
    }

    @PostMapping("/addVaoGioHangCoDangNhap")
    public Boolean addVaoGioHangCoDangNhap(@RequestParam(required = false) String idSanPhamChiTiet, @RequestParam(required = false) String soLuong, @RequestParam(required = false) String gia, @RequestParam(required = false) String idKhachHang) {
        return gioHangService.addVaoGioHangCoDangNhap(
                Integer.parseInt(idSanPhamChiTiet), Integer.parseInt(soLuong), Double.parseDouble(gia), Integer.parseInt(idKhachHang));
    }

    @PostMapping("/layDuLieuCartVaXoaSanPhamSoLuong0")
    public List<SPCTDTO.SanPhamCart> layDuLieuCartVaXoaSanPhamSoLuong0(@RequestParam(required = false) String idKhachHang) {
        return gioHangService.layDuLieuCartVaXoaSanPhamSoLuong0(
                Integer.parseInt(idKhachHang));
    }

    @PostMapping("/xoaSanPhamKhoiGioHangCoDangNhap")
    public Boolean xoaSanPhamKhoiGioHangCoDangNhap(@RequestParam(required = false) String idSanPhamChiTiet, @RequestParam(required = false) String idKhachHang) {
        return gioHangService.xoaSanPhamKhoiGioHangCoDangNhap(
                Integer.parseInt(idSanPhamChiTiet), Integer.parseInt(idKhachHang));
    }

    @PostMapping("/tangSoLuongSanPhamCoDangNhap")
    public Boolean tangSoLuongSanPhamCoDangNhap(@RequestParam(required = false) String idSanPhamChiTiet, @RequestParam(required = false) String idKhachHang) {
        return gioHangService.tangSoLuongSanPhamCoDangNhap(
                Integer.parseInt(idSanPhamChiTiet), Integer.parseInt(idKhachHang));
    }

    @PostMapping("/giamSoLuongSanPhamCoDangNhap")
    public Boolean giamSoLuongSanPhamCoDangNhap(@RequestParam(required = false) String idSanPhamChiTiet, @RequestParam(required = false) String idKhachHang) {
        return gioHangService.giamSoLuongSanPhamCoDangNhap(
                Integer.parseInt(idSanPhamChiTiet), Integer.parseInt(idKhachHang));
    }
}
