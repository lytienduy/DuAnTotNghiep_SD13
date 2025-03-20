package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.BanHangTaiQuayResponseDTO;
import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.dto.Client.SanPhamDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.*;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class HomeService {
    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;

    @Autowired
    private SanPhamRepositoryP sanPhamRepositoryP;
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

    //P
    public HomeDTO.SizeCuaPhong convertSangListSizeCuaPhong(SanPhamChiTiet sanPhamChiTiet) {
        return new HomeDTO.SizeCuaPhong(
                sanPhamChiTiet.getId(),
                sanPhamChiTiet.getSanPham().getTenSanPham() + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang() + " - " + sanPhamChiTiet.getMauSac().getTenMauSac() + " -sz" + sanPhamChiTiet.getSize().getTenSize(),
                sanPhamChiTiet.getSize().getId(),
                sanPhamChiTiet.getSize().getMa(),
                sanPhamChiTiet.getSize().getTenSize(),
                sanPhamChiTiet.getSoLuong()
        );
    }

    public List<HomeDTO.SanPhamClient> getListSanPhamQuanAuNamDanhMucTheoDanhMuc(String tenDanhMuc) {
        List<HomeDTO.SanPhamClient> listTraVe = new ArrayList<>();
        List<SanPham> listSP = sanPhamChiTietRepositoryP.getListSanPhamTheoTenDanhMucVaDangHoatDong(tenDanhMuc);
        for (SanPham sanPham : listSP
        ) {
            HomeDTO.SanPhamClient tongQuanSanPhamCTClient = new HomeDTO.SanPhamClient();//Tạo ra đối tượng của listTraVe
            tongQuanSanPhamCTClient.setId(sanPham.getId());
            List<HomeDTO.MauSacAndHinhAnhAndSize> listCacBienTheMauSacCuaSP = new ArrayList<>();//Tạo ra list để lưu những sản phẩm màu sắc, hình ảnh và size của sản phẩm
            List<MauSac> listMauSac = sanPhamChiTietRepositoryP.getMauSacTheoIDSanPhamAndTrangThaiAndDanhMuc(sanPham.getId(), "Hoạt động", tenDanhMuc);//Lấy những sản phẩm chi tiết phân biệt theo màu sắc
            int index = 0;
            for (MauSac mauSac : listMauSac//Chạy foreach lấy list size theo màu
            ) {
                HomeDTO.MauSacAndHinhAnhAndSize mauSacAndHinhAnhAndSize = new HomeDTO.MauSacAndHinhAnhAndSize();
                mauSacAndHinhAnhAndSize.setMauSac(mauSac);
                List<SanPhamChiTiet> listSPCT = sanPhamChiTietRepositoryP.findBySanPhamAndMauSacAndTrangThaiAndDanhMuc_TenDanhMuc(sanPham, mauSac, "Hoạt động", tenDanhMuc);
                for (SanPhamChiTiet sanPhamChiTiet : listSPCT
                ) {
                    if (index == 0) {
                        tongQuanSanPhamCTClient.setTen(sanPham.getTenSanPham() + " " + sanPhamChiTiet.getChatLieu().getTenChatLieu() + " " + sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang());
                        tongQuanSanPhamCTClient.setGia(sanPhamChiTiet.getGia());
                    }
                    if (sanPhamChiTiet.getListAnh().isEmpty() == false) {
                        mauSacAndHinhAnhAndSize.setListAnh(listURLAnhSanPham(sanPhamChiTiet.getListAnh()));
                        break;
                    }
                    ++index;
                }
                mauSacAndHinhAnhAndSize.setListSize(listSPCT.stream().map(this::convertSangListSizeCuaPhong).collect(Collectors.toList()));
                listCacBienTheMauSacCuaSP.add(mauSacAndHinhAnhAndSize);
            }
            tongQuanSanPhamCTClient.setListHinhAnhAndMauSacAndSize(listCacBienTheMauSacCuaSP);
            if (tongQuanSanPhamCTClient.getListHinhAnhAndMauSacAndSize().size() > 0) {
                listTraVe.add(tongQuanSanPhamCTClient);
            }
        }
        return listTraVe;
    }

    public List<HomeDTO.SanPhamClient> getListSanPhamQuanAuNamDanhMucTopBanChay() {
        Pageable pageable = PageRequest.of(0, 6);
        LocalDateTime now = LocalDateTime.now();
        // Lấy thời gian của 2 tháng trước
        LocalDateTime twoMonthsAgo = now.minusMonths(2);
        List<HomeDTO.SanPhamClient> listTraVe = new ArrayList<>();
        List<SanPham> listSP = sanPhamChiTietRepositoryP.findTopSanPhamChiTietBanChay("Hoạt động",twoMonthsAgo, now, pageable);
        for (SanPham sanPham : listSP //Chạy một vòng các sp để lấy các biển thế màu
        ) {
            HomeDTO.SanPhamClient tongQuanSanPhamCTClient = new HomeDTO.SanPhamClient();//Tạo ra đối tượng của listTraVe
            tongQuanSanPhamCTClient.setId(sanPham.getId());
            List<HomeDTO.MauSacAndHinhAnhAndSize> listMauSacAndSizeCuaSp = new ArrayList<>();//Tạo ra list để lưu những sản phẩm màu sắc, hình ảnh và size của sản phẩm
            List<MauSac> listMauSac = sanPhamChiTietRepositoryP.getMauSacTheoIDSanPhamAndTrangThai(sanPham.getId(), "Hoạt động");//Lấy những sản phẩm chi tiết phân biệt theo màu sắc
            int index = 0;
            for (MauSac mauSac : listMauSac//Chạy foreach lấy list size theo màu
            ) {
                HomeDTO.MauSacAndHinhAnhAndSize mauSacAndHinhAnhAndSize = new HomeDTO.MauSacAndHinhAnhAndSize();

                mauSacAndHinhAnhAndSize.setMauSac(mauSac);
                List<SanPhamChiTiet> listSPCT = sanPhamChiTietRepositoryP.findBySanPhamAndMauSacAndTrangThai(sanPham, mauSac, "Hoạt động");
                for (SanPhamChiTiet sanPhamChiTiet : listSPCT //Lấy các biến thể size của màu
                ) {
                    if (index == 0) {
                        tongQuanSanPhamCTClient.setTen(sanPham.getTenSanPham() + " " + sanPhamChiTiet.getChatLieu().getTenChatLieu() + " " + sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang());
                        tongQuanSanPhamCTClient.setGia(sanPhamChiTiet.getGia());
                    }
                    if (sanPhamChiTiet.getListAnh().isEmpty() == false) {
                        mauSacAndHinhAnhAndSize.setListAnh(listURLAnhSanPham(sanPhamChiTiet.getListAnh()));
                        break;
                    }
                    ++index;
                }
                mauSacAndHinhAnhAndSize.setListSize(listSPCT.stream().map(this::convertSangListSizeCuaPhong).collect(Collectors.toList()));
                listMauSacAndSizeCuaSp.add(mauSacAndHinhAnhAndSize);
            }
            tongQuanSanPhamCTClient.setListHinhAnhAndMauSacAndSize(listMauSacAndSizeCuaSp);
            if (tongQuanSanPhamCTClient.getListHinhAnhAndMauSacAndSize().size() > 0) {
                listTraVe.add(tongQuanSanPhamCTClient);
            }
        }
        return listTraVe;
    }


}
