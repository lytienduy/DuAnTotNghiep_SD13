package com.example.shopdragonbee.controller.Client;


import com.example.shopdragonbee.dto.BanHangTaiQuayResponseDTO;
import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.repository.SanPhamChiTietRepositoryP;
import com.example.shopdragonbee.repository.SanPhamRepository;
import com.example.shopdragonbee.repository.SanPhamRepositoryP;
import com.example.shopdragonbee.service.Client.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.sound.midi.ShortMessage;
import java.util.List;

@RestController
@RequestMapping("/home")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})

public class HomeController {

    @Autowired
    private SanPhamRepositoryP sanPhamRepositoryP;

    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;

    @Autowired
    private HomeService homeService;


    //Lấy list sản phẩm danh mục business
    @GetMapping("/getListSanPhamQuanAuNamDanhMucBusiness")
    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListSanPhamQuanAuNamDanhMucBusiness() {
        return homeService.getListSanPhamQuanAuNamDanhMucBusiness();
    }

    //Lấy list sản phẩm danh mục golf
    @GetMapping("/getListSanPhamQuanAuNamDanhMucGolf")
    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListSanPhamQuanAuNamDanhMucGolf() {
        return homeService.getListSanPhamQuanAuNamDanhMucGolf();
    }

    //Lấy list sản phẩm danh mục casual
    @GetMapping("/getListSanPhamQuanAuNamDanhMucCasual")
    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListSanPhamQuanAuNamDanhMucCasual() {
        return homeService.getListSanPhamQuanAuNamDanhMucCasual();
    }

    //Lấy list sản phẩm danh mục casual
    @GetMapping("/getListTopSanPhamBanChay")
    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListTopSanPhamBanChay() {
        return homeService.getListTopSanPhamBanChay();
    }

    //Nhập số lượng sản phẩm từ bán phím
    @GetMapping("/layListCacSanPhamHienThi")
    public List<HomeDTO.SanPhamHienThiTrangSanPhamClient> layListCacSanPhamHienThi(
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
        return homeService.getListSanPhamTheoBoLoc(timKiem, fromGia, toGia, danhMuc, mauSac, chatLieu, kichCo, kieuDang, thuongHieu, phongCach);
    }

    @GetMapping("/layListCacSanPhamHienThi/{idSanPham}")

    public List<HomeDTO.ListSanPhamChiTietClient> getListHienThiTrongSanPhamChiTiet(@PathVariable Integer idSanPham) {
        return homeService.getListHienThiTrongSanPhamChiTiet(idSanPham);
    }
}
