package com.example.shopdragonbee.controller.Client;

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
    public List<SPCTDTO.SanPhamCart> getListDanhSachCapNhatSoLuongSanPhamGioHang(@RequestBody Map<String, Object> requestData) {
        Integer idKhachHang = (Integer) requestData.get("idKhachHang");
        List<SPCTDTO.SanPhamCart> cart = (List<SPCTDTO.SanPhamCart>) requestData.get("cart");
        return gioHangService.getListDanhSachCapNhatSoLuongSanPhamGioHang(idKhachHang, cart);
    }

    @PostMapping("/getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang")
    public List<SPCTDTO.SanPhamCart> getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang(@RequestBody Map<String, Object> requestData) {
        Integer idKhachHang = (Integer) requestData.get("idKhachHang");
        List<SPCTDTO.SanPhamCart> cart = (List<SPCTDTO.SanPhamCart>) requestData.get("cart");
        return gioHangService.getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang(idKhachHang, cart);
    }

    @PostMapping("/addVaoGioHangCoDangNhap")
    public Boolean addVaoGioHangCoDangNhap(@RequestParam String idSanPhamChiTiet, @RequestParam String soLuong, @RequestParam String gia, @RequestParam String idKhachHang) {
        return gioHangService.addVaoGioHangCoDangNhap(
                Integer.parseInt(idSanPhamChiTiet), Integer.parseInt(soLuong), Double.parseDouble(gia), Integer.parseInt(idKhachHang));
    }

    @PostMapping("/xoaNhungSanPhamCoSoLuong0")
    public List<SPCTDTO.SanPhamCart> xoaNhungSanPhamCoSoLuong0(@RequestParam String idKhachHang) {
        return gioHangService.layDuLieuCartVaXoaSanPhamSoLuong0(
                Integer.parseInt(idKhachHang));
    }

    @PostMapping("/xoaSanPhamKhoiGioHangCoDangNhap")
    public Boolean xoaSanPhamKhoiGioHangCoDangNhap(@RequestParam String idSanPhamChiTiet, @RequestParam String idKhachHang) {
        return gioHangService.xoaSanPhamKhoiGioHangCoDangNhap(
                Integer.parseInt(idSanPhamChiTiet), Integer.parseInt(idKhachHang));
    }
    @PostMapping("/tangSoLuongSanPhamCoDangNhap")
    public Boolean tangSoLuongSanPhamCoDangNhap(@RequestParam String idSanPhamChiTiet, @RequestParam String idKhachHang) {
        return gioHangService.tangSoLuongSanPhamCoDangNhap(
                Integer.parseInt(idSanPhamChiTiet), Integer.parseInt(idKhachHang));
    }

    @PostMapping("/giamSoLuongSanPhamCoDangNhap")
    public Boolean giamSoLuongSanPhamCoDangNhap(@RequestParam String idSanPhamChiTiet, @RequestParam String idKhachHang) {
        return gioHangService.giamSoLuongSanPhamCoDangNhap(
                Integer.parseInt(idSanPhamChiTiet), Integer.parseInt(idKhachHang));
    }
}
