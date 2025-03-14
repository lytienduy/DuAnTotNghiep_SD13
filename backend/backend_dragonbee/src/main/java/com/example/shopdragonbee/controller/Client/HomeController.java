package com.example.shopdragonbee.controller.Client;


import com.example.shopdragonbee.dto.BanHangTaiQuayResponseDTO;
import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.repository.SanPhamChiTietRepositoryP;
import com.example.shopdragonbee.repository.SanPhamRepository;
import com.example.shopdragonbee.service.Client.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/home")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})

public class HomeController {

    @Autowired
    private SanPhamRepository sanPhamRepository;

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
}
