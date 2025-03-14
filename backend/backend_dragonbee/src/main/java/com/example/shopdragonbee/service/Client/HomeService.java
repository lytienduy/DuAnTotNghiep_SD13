package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.BanHangTaiQuayResponseDTO;
import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.HoaDonChiTietRepository;
import com.example.shopdragonbee.repository.SanPhamChiTietRepositoryP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class HomeService {
    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;

    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    //Chuyển đổi lấy list url hình ảnh theo listAnhSanPham
    public List<String> listURLAnhSanPham(List<AnhSanPham> list) {
        List<String> listUrl = new ArrayList<>();
        for (AnhSanPham anh : list
        ) {
            listUrl.add(anh.getAnhUrl());
        }
        return listUrl;
    }

    //Chuyển đổi sang object có những thông tin bên Hóa Đơn Chi Tiết
    public HomeDTO.SanPhamHienThiTrangHomeClient convertSanPhamHienThiTrangHomeClient(SanPham sanPham) {
        SanPhamChiTiet spct = sanPhamChiTietRepositoryP.findTopBySanPhamOrderByNgayTaoDesc(sanPham);
        return new HomeDTO.SanPhamHienThiTrangHomeClient(
                sanPham.getId(),
                sanPham.getMa(),
                sanPham.getTenSanPham() + spct.getDanhMuc().getTenDanhMuc() + " " + spct.getKieuDang().getTenKieuDang(),
                listURLAnhSanPham(spct != null ? spct.getListAnh() : Collections.emptyList()),
                spct.getGia()
        );
    }

    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListSanPhamQuanAuNamDanhMucBusiness() {
        List<SanPham> listSP = sanPhamChiTietRepositoryP.getListSanPhamTheoTenDanhMucVaDangHoatDong("Business");
        return listSP.stream().map(this::convertSanPhamHienThiTrangHomeClient).collect(Collectors.toList());
    }

    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListSanPhamQuanAuNamDanhMucGolf() {
        List<SanPham> listSP = sanPhamChiTietRepositoryP.getListSanPhamTheoTenDanhMucVaDangHoatDong("Golf");
        return listSP.stream().map(this::convertSanPhamHienThiTrangHomeClient).collect(Collectors.toList());
    }

    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListSanPhamQuanAuNamDanhMucCasual() {
        List<SanPham> listSP = sanPhamChiTietRepositoryP.getListSanPhamTheoTenDanhMucVaDangHoatDong("Casual");
        return listSP.stream().map(this::convertSanPhamHienThiTrangHomeClient).collect(Collectors.toList());
    }

    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListTopSanPhamBanChay() {
        Pageable pageable = PageRequest.of(0, 6);
        List<SanPham> listSP = hoaDonChiTietRepository.findTopSanPhamChiTietBanChay(pageable);
        return listSP.stream().map(this::convertSanPhamHienThiTrangHomeClient).collect(Collectors.toList());
    }
}
