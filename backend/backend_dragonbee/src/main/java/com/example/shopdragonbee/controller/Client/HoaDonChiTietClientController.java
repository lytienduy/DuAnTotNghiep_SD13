package com.example.shopdragonbee.controller.Client;

import com.example.shopdragonbee.dto.BanHangTaiQuayResponseDTO;
import com.example.shopdragonbee.dto.Client.GioHangDTO;
import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.service.Client.HoaDonChiTietClientService;
import com.example.shopdragonbee.service.Client.HomeService;
import com.example.shopdragonbee.service.Client.SanPhamChiTietClientService;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hdctClient")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class HoaDonChiTietClientController {
    @Autowired
    private HoaDonChiTietClientService hoaDonChiTietClientService;

    @GetMapping("/client/{id}")
    public HoaDonChiTietResponseDTO.HoaDonChiTietDTO getHoaDonByIdClient(@PathVariable Integer id) {
        return hoaDonChiTietClientService.getHoaDonByIdClient(id);
    }

    @PostMapping("/addSanPhamSauKhiDatHang")
    public String addSanPhamSauKhiDatHang(@RequestBody Map<String, String> body) {
        String idHoaDon = body.get("idHoaDon");
        String idSanPhamChiTiet = body.get("idSanPhamChiTiet");
        String soLuong = body.get("soLuong");
        String donGia = body.get("donGia");
        String tenUser = body.get("tenUser");

        return hoaDonChiTietClientService.addSanPhamVaoGioHangOnlineSauKhiDatHang(
                java.lang.Integer.parseInt(idHoaDon)
                , java.lang.Integer.parseInt(idSanPhamChiTiet),
                java.lang.Integer.parseInt(soLuong),
                Double.parseDouble(donGia),
                tenUser);
    }

    //Tăng số lượng 1
    @PostMapping("/tangSoLuongOnline/{id}")
    public String tangSoLuongOnline(@PathVariable Integer id) {
        return hoaDonChiTietClientService.tangSoLuongOnline(id);
    }

    //Giảm số lượng 1
    @PostMapping("/giamSoLuongOnline/{id}")
    public String giamSoLuongOnline(@PathVariable Integer id) {
        return hoaDonChiTietClientService.giamSoLuongOnline(id);
    }

    //Xóa sản phẩm khỏi giỏ hàng bán hàng tại quầy
    @PostMapping("/xoaSanPhamSauKhiDatHang/{id}/{idHoaDon}/{tenUser}")
    public String xoaSanPhamSauKhiDatHang(@PathVariable Integer id, @PathVariable Integer idHoaDon, @PathVariable String tenUser) {
        return hoaDonChiTietClientService.xoaSanPhamOnline(id, idHoaDon,tenUser);
    }

    //Nhập số lượng sản phẩm từ bán phím
    @PostMapping("/nhapSoLuongOnline/{id}/{soLuong}")
    public String nhapSoLuongOnline(@PathVariable Integer id, @PathVariable Integer soLuong) {
        return hoaDonChiTietClientService.nhapSoLuongOnline(id, soLuong);
    }

    @GetMapping("/getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang")
    public List<HoaDonChiTietResponseDTO.SoLuongGocVaConLaiCuaSPCTTrongHDCT> getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang(@RequestParam(required = false) Integer idHoaDon) {
        return hoaDonChiTietClientService.getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang(idHoaDon);
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
            @RequestParam(required = false) Integer phongCach,
            @RequestParam(required = false) Integer idHoaDon
    ) {
        return hoaDonChiTietClientService.getListCacSanPhamHienThiTrongThemBanHangTaiQuay(timKiem, fromGia, toGia, danhMuc, mauSac, chatLieu, kichCo, kieuDang, thuongHieu, phongCach, idHoaDon);
    }

    @GetMapping("/layListDanhMuc")
    public BanHangTaiQuayResponseDTO.LuuListCacBoLocThemSanPham getListDanhMuc() {
        return hoaDonChiTietClientService.getToanBoListBoLoc();
    }
}
