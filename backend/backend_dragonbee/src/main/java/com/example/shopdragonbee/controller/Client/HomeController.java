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
    public List<HomeDTO.SanPhamClient> getListSanPhamQuanAuNamDanhMucBusiness() {
        return homeService.getListSanPhamQuanAuNamDanhMucTheoDanhMuc("Business");
    }

    //Lấy list sản phẩm danh mục golf
    @GetMapping("/getListSanPhamQuanAuNamDanhMucGolf")
    public List<HomeDTO.SanPhamClient> getListSanPhamQuanAuNamDanhMucGolf() {
        return homeService.getListSanPhamQuanAuNamDanhMucTheoDanhMuc("Golf");
    }

    //Lấy list sản phẩm danh mục casual
    @GetMapping("/getListSanPhamQuanAuNamDanhMucCasual")
    public List<HomeDTO.SanPhamClient> getListSanPhamQuanAuNamDanhMucCasual() {
        return homeService.getListSanPhamQuanAuNamDanhMucTheoDanhMuc("Casual");
    }

    //Lấy list sản phẩm danh mục casual
    @GetMapping("/getListTopSanPhamBanChay")
    public List<HomeDTO.SanPhamClient> getListTopSanPhamBanChay() {
        return homeService.getListSanPhamQuanAuNamDanhMucTopBanChay();
    }




}
