package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SanPhamChiTietClientService {

    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;

    @Autowired
    private SanPhamRepositoryP sanPhamRepositoryP;
    @Autowired
    private GioHangRepository gioHangRepository;
    @Autowired
    private GioHangChiTietRepository gioHangChiTietRepository;
    @Autowired
    private HomeService homeService;

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

    public SPCTDTO.SanPhamCart convertSangSanPhamCart(GioHangChiTiet gioHangChiTiet) {
        SPCTDTO.SanPhamCart sanPhamCart = new SPCTDTO.SanPhamCart();
        SanPhamChiTiet sanPhamChiTiet = gioHangChiTiet.getSanPhamChiTiet();
        sanPhamCart.setId(sanPhamChiTiet.getSanPham().getId());
        sanPhamCart.setIdSPCT(sanPhamChiTiet.getId());
        if (sanPhamChiTiet.getListAnh().isEmpty() == false) {
            sanPhamCart.setAnhSPCT(sanPhamChiTiet.getListAnh().get(0).getAnhUrl());
        }
        sanPhamCart.setTenSPCT(sanPhamChiTiet.getSanPham().getTenSanPham() + " " + sanPhamChiTiet.getChatLieu().getTenChatLieu() + " " + sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang());
        sanPhamCart.setTenMauSac(sanPhamChiTiet.getMauSac().getTenMauSac());
        sanPhamCart.setTenSize(sanPhamChiTiet.getSize().getTenSize());
        sanPhamCart.setGia(sanPhamChiTiet.getGia());
        sanPhamCart.setQuantity(gioHangChiTiet.getSoLuong());
        return sanPhamCart;
    }

    public SPCTDTO.SanPhamChiTietClient getSanPhamChiTietClient(Integer idSanPham, Integer idKhachHang, List<SPCTDTO.SanPhamCart> listDanhSachSanPhamCart) {
        //Nếu khách hàng không đăng nhập thì dựa trên local
        if (sanPhamRepositoryP.findById(idSanPham).get().getTrangThai().equalsIgnoreCase("Hoạt động") == false) {
            return null;
        }
        if (idKhachHang == null) {
            idSet = listDanhSachSanPhamCart.stream().collect(Collectors.toMap(SPCTDTO.SanPhamCart::getIdSPCT, sp -> sp));
        } else {//nếu khách có đăng nhập
            Optional<GioHang> gioHang = gioHangRepository.findById(idKhachHang);
            if (gioHang.isPresent()) {
                List<SPCTDTO.SanPhamCart> listChuyenDoiGioHangChiTietSangSanPhamCart = gioHangChiTietRepository.findByGioHangOrderByNgayTaoDesc(gioHang.get()).stream()
                        .map(this::convertSangSanPhamCart) // Gọi hàm convert từng phần tử
                        .collect(Collectors.toList());
                idSet = listChuyenDoiGioHangChiTietSangSanPhamCart.stream().collect(Collectors.toMap(SPCTDTO.SanPhamCart::getIdSPCT, sp -> sp));
            } else {
                idSet = Collections.emptyMap();
            }
        }
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
                    tongQuanSanPhamCTClient.setDanhMuc(sanPhamChiTiet.getDanhMuc());
                    tongQuanSanPhamCTClient.setThuongHieu(sanPhamChiTiet.getThuongHieu());
                    tongQuanSanPhamCTClient.setXuatXu(sanPhamChiTiet.getXuatXu());
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



    public List<HomeDTO.SanPhamClient> getListSanPhamTuongTu(Integer idSanPham, String tenDanhMuc) {
        List<HomeDTO.SanPhamClient> listTraVe = new ArrayList<>();
        listTraVe.addAll(homeService.getListSanPhamQuanAuNamDanhMucTheoDanhMucTop3(tenDanhMuc, idSanPham));
        listTraVe.addAll(homeService.getListSanPhamQuanAuNamDanhMucTopBanChay());
        // Nếu muốn loại trùng sản phẩm theo ID
        Map<Integer, HomeDTO.SanPhamClient> uniqueMap = listTraVe.stream()
                .collect(Collectors.toMap(HomeDTO.SanPhamClient::getId, sp -> sp, (sp1, sp2) -> sp1));
        return  new ArrayList<>(uniqueMap.values());
    }

}
