package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.BanHangTaiQuayResponseDTO;
import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.repository.DanhMucRepositoryP;
import com.example.shopdragonbee.repository.HoaDonChiTietRepository;
import com.example.shopdragonbee.repository.SanPhamChiTietRepositoryP;
import com.example.shopdragonbee.service.BanHangTaiQuayService;
import com.example.shopdragonbee.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ban-hang-tai-quay")
// Cho phép gọi API từ frontend
//@CrossOrigin(origins = "*")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class BanHangTaiQuayController {
    @Autowired
    private HoaDonService hoaDonService;
    @Autowired
    private BanHangTaiQuayService banHangTaiQuayService;

    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepository;

    @Autowired
    private DanhMucRepositoryP danhMucRepositoryP;

    //Thêm hóa đơn tại quầy
    @GetMapping("/addHoaDonTaiQuay")
    public HoaDon addHoaDonTaiQuayVaChoThanhToan() {
        return banHangTaiQuayService.taoHoaDon();
    }

    //Lấy hóa đơn tại quầy
    @GetMapping("/layHoaDonTaiQuay")
    public List<HoaDonChiTietResponseDTO.HoaDonChiTietDTO> layHoaDonTaiQuay() {
        return hoaDonService.getHoaDonChiTietTaiQuay();
    }

    //Tăng số lượng 1
    @PostMapping("/tangSoLuong/{id}")
    public Boolean tangSoLuong(@PathVariable Integer id) {
        return banHangTaiQuayService.tangSoLuong(id);
    }

    //Giảm số lượng 1
    @PostMapping("/giamSoLuong/{id}")
    public Boolean giamSoLuong(@PathVariable Integer id) {
        return banHangTaiQuayService.giamSoLuong(id);
    }

    //Xóa sản phẩm khỏi giỏ hàng bán hàng tại quầy
    @PostMapping("/xoaSanPham/{id}/{idHoaDon}")
    public Boolean xoaSanPham(@PathVariable Integer id,@PathVariable Integer idHoaDon) {
        return banHangTaiQuayService.xoaSanPham(id,idHoaDon);
    }

    //Nhập số lượng sản phẩm từ bán phím
    @PostMapping("/nhapSoLuong/{id}/{soLuong}")
    public Boolean nhapSoLuong(@PathVariable Integer id, @PathVariable Integer soLuong) {
        return banHangTaiQuayService.nhapSoLuong(id, soLuong);
    }

    //Nhập số lượng sản phẩm từ bán phím
    @GetMapping("/layListCacSanPhamHienThiThem")
    public List<BanHangTaiQuayResponseDTO.SanPhamHienThiTrongThemBanHangTaiQuay> layListCacSanPhamHienThiThem(
            @RequestParam(required = false) String timKiem,
            @RequestParam(required = false) Integer fromGia,
            @RequestParam(required = false) Integer toGia,
            @RequestParam(required = false) Integer danhMuc,
            @RequestParam(required = false) Integer mauSac,
            @RequestParam(required = false) Integer chatLieu,
            @RequestParam(required = false) Integer kichCo,
            @RequestParam(required = false) Integer kieuDang,
            @RequestParam(required = false) Integer thuongHieu,
            @RequestParam(required = false) Integer phongCach
    ) {
        return banHangTaiQuayService.getListCacSanPhamHienThiTrongThemBanHangTaiQuay(timKiem, fromGia, toGia, danhMuc, mauSac, chatLieu, kichCo, kieuDang, thuongHieu, phongCach);
    }

    @GetMapping("/layListDanhMuc")
    public BanHangTaiQuayResponseDTO.LuuListCacBoLocThemSanPham getListDanhMuc() {
        return banHangTaiQuayService.getToanBoListBoLoc();
    }

    @PostMapping("/addSanPhamVaoGioHang")
    public Boolean addSanPhamVaoGioHang(@RequestBody Map<String, String> body) {
        String idHoaDon = body.get("idHoaDon");
        String idSanPhamChiTiet = body.get("idSanPhamChiTiet");
        String soLuong = body.get("soLuong");
        String donGia = body.get("donGia");

        return banHangTaiQuayService.addSanPhamVaoGioHang(
                java.lang.Integer.parseInt(idHoaDon)
                , java.lang.Integer.parseInt(idSanPhamChiTiet),
                java.lang.Integer.parseInt(soLuong),
                java.lang.Float.parseFloat(donGia));
    }

    @PostMapping("/thanhToanHoaDon")
    public Boolean thanhToanHoaDon(@RequestBody Map<String, String> body) {
        String idHoaDon = body.get("idHoaDon");
        String pttt = body.get("pttt");
        String tienMat = body.get("tienMat");
        String chuyenKhoan = body.get("chuyenKhoan");

        return banHangTaiQuayService.thanhToanHoaDon(
                java.lang.Integer.parseInt(idHoaDon), pttt,
                Float.parseFloat(tienMat),
                Float.parseFloat(chuyenKhoan));
    }


}
