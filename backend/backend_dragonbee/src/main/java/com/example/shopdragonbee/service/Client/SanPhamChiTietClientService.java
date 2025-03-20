package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.MauSac;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.SanPhamChiTietRepositoryP;
import com.example.shopdragonbee.repository.SanPhamRepositoryP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SanPhamChiTietClientService {

    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;

    @Autowired
    private SanPhamRepositoryP sanPhamRepositoryP;

    private Map<Integer, SPCTDTO.SanPhamCart> idSet = new HashMap<>();

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
    public SPCTDTO.SizeCuaPhong convertSangListSizeCuaPhong(SanPhamChiTiet sanPhamChiTiet) {
        SPCTDTO.SanPhamCart sanPhamTrungTrongCart = idSet.get(sanPhamChiTiet.getId());
        if (sanPhamTrungTrongCart != null) {
            sanPhamChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong() - sanPhamTrungTrongCart.getQuantity());
        }
        return new SPCTDTO.SizeCuaPhong(
                sanPhamChiTiet.getId(),
                sanPhamChiTiet.getSanPham().getTenSanPham() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang() + " - " + sanPhamChiTiet.getMauSac().getTenMauSac() + " - sz" + sanPhamChiTiet.getSize().getTenSize(),
                sanPhamChiTiet.getSize().getId(),
                sanPhamChiTiet.getSize().getMa(),
                sanPhamChiTiet.getSize().getTenSize(),
                sanPhamChiTiet.getSoLuong()
        );
    }

    public SPCTDTO.SanPhamChiTietClient getSanPhamChiTietClient(Integer idSanPham, List<SPCTDTO.SanPhamCart> listDanhSachSanPhamCart) {
        idSet = listDanhSachSanPhamCart.stream().collect(Collectors.toMap(SPCTDTO.SanPhamCart::getIdSPCT, sp -> sp));
        SPCTDTO.SanPhamChiTietClient tongQuanSanPhamCTClient = new SPCTDTO.SanPhamChiTietClient();//Tạo ra đối tượng lưu thông tin sanPhamChiTiet
        List<SPCTDTO.MauSacAndHinhAnhAndSize> listMauSacAndSizeCuaSp = new ArrayList<>();//Tạo ra list để lưu những sản phẩm màu sắc của đối tượng
        List<MauSac> listMauSac = sanPhamChiTietRepositoryP.getMauSacTheoIDSanPhamAndTrangThai(idSanPham, "Hoạt động");//Lấy những sản phẩm chi tiết phân biệt theo màu sắc
        int index = 0;
        for (MauSac mauSac : listMauSac//Chạy foreach lấy list size theo màu
        ) {
            //
            SPCTDTO.MauSacAndHinhAnhAndSize mauSacAndHinhAnhAndSize = new SPCTDTO.MauSacAndHinhAnhAndSize();
            mauSacAndHinhAnhAndSize.setMauSac(mauSac);
            //
            SanPham sp = sanPhamRepositoryP.findById(idSanPham).get();
            List<SanPhamChiTiet> listSPCT = sanPhamChiTietRepositoryP.findBySanPhamAndMauSacAndTrangThai(sp, mauSac, "Hoạt động");
            for (SanPhamChiTiet sanPhamChiTiet : listSPCT//For này chỉ để lấy tên và ảnh của sản phẩm
            ) {
                if (index == 0) {
                    tongQuanSanPhamCTClient.setTen(sp.getTenSanPham() + " " + sanPhamChiTiet.getChatLieu().getTenChatLieu() + " " + sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang());
                    tongQuanSanPhamCTClient.setMoTa(sanPhamChiTiet.getMoTa());
                    tongQuanSanPhamCTClient.setGia(sanPhamChiTiet.getGia());
                    tongQuanSanPhamCTClient.setKieuDang(sanPhamChiTiet.getKieuDang());
                    tongQuanSanPhamCTClient.setChatLieu(sanPhamChiTiet.getChatLieu());
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
        return tongQuanSanPhamCTClient;
    }
//    public List<SPCTDTO.SizeCuaPhong> getListSizeDeUpdateKhiChonMau(Integer idSanPham) {
//            //
//            SanPham sp = sanPhamRepositoryP.findById(idSanPham).get();
//            List<SanPhamChiTiet> listSPCT = sanPhamChiTietRepositoryP.findBySanPhamAndMauSacAndTrangThai(sp, mauSac, "Hoạt động");
//            for (SanPhamChiTiet sanPhamChiTiet : listSPCT
//            ) {
//                if (index == 0) {
//                    tongQuanSanPhamCTClient.setTen(sp.getTenSanPham() + " " + sanPhamChiTiet.getChatLieu().getTenChatLieu() + " " + sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang());
//                    tongQuanSanPhamCTClient.setMoTa(sanPhamChiTiet.getMoTa());
//                    tongQuanSanPhamCTClient.setGia(sanPhamChiTiet.getGia());
//                    tongQuanSanPhamCTClient.setKieuDang(sanPhamChiTiet.getKieuDang());
//                    tongQuanSanPhamCTClient.setChatLieu(sanPhamChiTiet.getChatLieu());
//                }
//                if (sanPhamChiTiet.getListAnh().isEmpty() == false) {
//                    mauSacAndHinhAnhAndSize.setListAnh(listURLAnhSanPham(sanPhamChiTiet.getListAnh()));
//                    break;
//                }
//                ++index;
//            }
//            mauSacAndHinhAnhAndSize.setListSize(listSPCT.stream().map(this::convertSangListSizeCuaPhong).collect(Collectors.toList()));
//            listMauSacAndSizeCuaSp.add(mauSacAndHinhAnhAndSize);
//
//        tongQuanSanPhamCTClient.setListHinhAnhAndMauSacAndSize(listMauSacAndSizeCuaSp);
//        return tongQuanSanPhamCTClient;
//    }
}
