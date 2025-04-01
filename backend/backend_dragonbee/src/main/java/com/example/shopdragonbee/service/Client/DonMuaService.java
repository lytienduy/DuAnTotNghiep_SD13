package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.Client.DonMuaDTO;
import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.entity.HoaDonChiTiet;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.HoaDonChiTietRepository;
import com.example.shopdragonbee.repository.HoaDonRepository;
import com.example.shopdragonbee.repository.KhachHangRepository;
import com.example.shopdragonbee.repository.SanPhamChiTietRepositoryP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DonMuaService {

    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;


    public List<DonMuaDTO.HoaDonClient> layHoaDonTheoTrangThaiVaKhachHang(String trangThai, Integer idKhachHang) {
        List<DonMuaDTO.HoaDonClient> listTraVe = new ArrayList<>();//Tạo listTraVe
        //Lấy list những hóa đơn theo trạng thái và id khách hàng sắp xếp theo ngày tạo từ mới đến cũ
        List<HoaDon> listHoaDon = hoaDonRepository.getHoaDonByTrangThaiAndKhachHangOrderByNgayTaoDesc(trangThai, khachHangRepository.findById(idKhachHang).get());
        //Chạy một vòng for với list hoaDon
        for (HoaDon hoaDon : listHoaDon
        ) {
            //Tạo một đối tượng hóa đơn
            DonMuaDTO.HoaDonClient hoaDonClient = new DonMuaDTO.HoaDonClient();
            hoaDonClient.setId(hoaDon.getId());
            hoaDonClient.setMaHoaDon(hoaDon.getMa());
            hoaDonClient.setTrangThai(hoaDon.getTrangThai());
            List<DonMuaDTO.SanPham> listSanPham = new ArrayList<>();
            for (HoaDonChiTiet hoaDonChiTiet : hoaDonChiTietRepository.getHoaDonChiTietByHoaDonAndTrangThaiOrderByNgayTaoDesc(hoaDon, "Hoạt động")
            ) {
                //Tạo ra đối tượng sản phẩm để lưu những sản phẩm đã mua của hóa đơn
                DonMuaDTO.SanPham sanPhamDTO = new DonMuaDTO.SanPham();
                //Tạo ra hai đối tượng lưu lại cho dễ gọi
                SanPham sanPham = hoaDonChiTiet.getSanPhamChiTiet().getSanPham();
                SanPhamChiTiet sanPhamChiTiet = hoaDonChiTiet.getSanPhamChiTiet();
                //set cho sản phẩm DTO
                sanPhamDTO.setId(sanPhamChiTiet.getId());
                sanPhamDTO.setIdSanPham(hoaDonChiTiet.getSanPhamChiTiet().getSanPham().getId());
                sanPhamDTO.setTenSanPham(sanPham.getTenSanPham() + " " + sanPhamChiTiet.getChatLieu().getTenChatLieu() + " " + sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang());
                sanPhamDTO.setMauSac(sanPhamChiTiet.getMauSac().getTenMauSac());
                sanPhamDTO.setSoLuong(hoaDonChiTiet.getSoLuong());
                sanPhamDTO.setGia(hoaDonChiTiet.getDonGia());
                sanPhamDTO.setSize(sanPhamChiTiet.getSize().getTenSize());
                if (sanPhamChiTiet.getListAnh().isEmpty() == false) {
                    sanPhamDTO.setHinhAnh(sanPhamChiTiet.getListAnh().get(0).getAnhUrl());
                }
                listSanPham.add(sanPhamDTO);
            }
            hoaDonClient.setSanPhams(listSanPham);
            listTraVe.add(hoaDonClient);
        }
        return listTraVe;
    }
}
