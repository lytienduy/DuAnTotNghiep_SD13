package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.entity.HoaDonChiTiet;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ThanhToanService {
    @Autowired
    HoaDonRepository hoaDonRepository;

    @Autowired
    HoaDonChiTietRepository hoaDonChiTietRepository;
    @Autowired
    SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;
    @Autowired
    KhachHangRepository khachHangRepository;
    @Autowired
    PhieuGiamGiaRepository phieuGiamGiaRepository;


    //Add sản phẩm vào giỏ hàng
    @Transactional
    public Boolean addSanPhamVaoHoaDonChiTiet(Integer idHoaDon, Integer idSanPhamChiTiet, Integer soLuong, Double donGia) {
        try {
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepositoryP.findById(idSanPhamChiTiet).get();
            HoaDonChiTiet kiemTraHDCTDaCoChua = hoaDonChiTietRepository.getHoaDonChiTietByHoaDonAndSanPhamChiTietAndDonGiaAndTrangThai(
                    hoaDonRepository.findById(idHoaDon).get(),
                    sanPhamChiTietRepositoryP.findById(idSanPhamChiTiet).get(),
                    donGia, "Hoạt động");

            if (kiemTraHDCTDaCoChua == null) {
                HoaDonChiTiet hoaDonChiTiet = new HoaDonChiTiet();
                hoaDonChiTiet.setMa("HDCT" + (System.currentTimeMillis() % 100000));
                hoaDonChiTiet.setHoaDon(hoaDonRepository.findById(idHoaDon).get());
                hoaDonChiTiet.setSanPhamChiTiet(sanPhamChiTietRepositoryP.findById(idSanPhamChiTiet).get());
                sanPhamChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong() - soLuong);
                hoaDonChiTiet.setSoLuong(soLuong);
                hoaDonChiTiet.setDonGia(donGia);
                hoaDonChiTiet.setNgayTao(LocalDateTime.now());
                hoaDonChiTiet.setTrangThai("Hoạt động");
                hoaDonChiTietRepository.save(hoaDonChiTiet);//lưu hóa đơn chi tiết
                sanPhamChiTietRepositoryP.save(sanPhamChiTiet);//set lại số lượng sản phẩm chi tiết
            } else {
                kiemTraHDCTDaCoChua.setSoLuong(kiemTraHDCTDaCoChua.getSoLuong() + soLuong);
                sanPhamChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong() - soLuong);
                kiemTraHDCTDaCoChua.setDonGia(donGia);
                kiemTraHDCTDaCoChua.setNgaySua(LocalDateTime.now());
                hoaDonChiTietRepository.save(kiemTraHDCTDaCoChua);//lưu hóa đơn chi tiết
                sanPhamChiTietRepositoryP.save(sanPhamChiTiet);//set lại số lượng sản phẩm chi tiết
            }
//            HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).get();
//            hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId()) + (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
//            hoaDonRepository.save(hoaDon);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public String xacNhanDatHangKhongDangNhap(
            String maHoaDon,
            String pgg,
            String tenNguoiNhan,
            String sdtNguoiNhan,
            String emailNguoiNhan,
            String diaChiNhanHang,
            Float tongTienPhaiTra,
            Float phiShip,
            String ghiChu,
            List<SPCTDTO.SanPhamCart> danhSachThanhToan,
            String idKhachHang) {
        try {
            //Tạo hóa đơn
            HoaDon hoaDon = hoaDonRepository.findHoaDonByMa(maHoaDon);
            if (hoaDon == null) {
                hoaDon = new HoaDon();
                hoaDon.setMa("HD" + (System.currentTimeMillis() % 100000));//Set mã
            }
            hoaDon.setLoaiDon("Online");//Set loại
            hoaDon.setTrangThai("Chờ xác nhận");//Set trạng thái
            hoaDon.setNgayTao(LocalDateTime.now());//Set ngày tạo
            if (pgg != null && pgg.trim().isBlank() == false) {//Kiểm tra check số lượng voucher
                PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository.findByMa(pgg.trim()).get();
                if (phieuGiamGia.getSoLuong() <= 0) {//Nếu hết
                    TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                    return "Hết phiếu giảm giá";
                } else {//Nếu còn thì set số lượng
                    phieuGiamGia.setSoLuong(phieuGiamGia.getSoLuong() - 1);
                    phieuGiamGiaRepository.save(phieuGiamGia);
                    hoaDon.setPhieuGiamGia(phieuGiamGia);
                }
            }
            hoaDon.setTenNguoiNhan(tenNguoiNhan);
            hoaDon.setSdt(sdtNguoiNhan);
            hoaDon.setEmailNguoiNhan(emailNguoiNhan);
            hoaDon.setDiaChiNhanHang(diaChiNhanHang);
            hoaDon.setPhiShip(phiShip);
            hoaDon.setTongTien(tongTienPhaiTra);
            if (idKhachHang != null) {
                hoaDon.setKhachHang(khachHangRepository.findById(Integer.parseInt(idKhachHang)).get());
            }
            hoaDon.setGhiChu(ghiChu);
            HoaDon hoaDonVuaTao = hoaDonRepository.save(hoaDon);//Tạo hóa đơn
            //Kiểm tra số lượng sản phẩm và tạo các hóa đơn chi tiết
            for (SPCTDTO.SanPhamCart sanPhamCart : danhSachThanhToan
            ) {
                SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepositoryP.findById(sanPhamCart.getIdSPCT()).get();
                if (sanPhamChiTiet.getSoLuong() < sanPhamCart.getQuantity()) {
                    TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                    return "Có sản phẩm không đủ số lượng";
                } else {
                    addSanPhamVaoHoaDonChiTiet(hoaDonVuaTao.getId(), sanPhamCart.getIdSPCT(), sanPhamCart.getQuantity(), sanPhamCart.getGia());
                }
            }
            return "OK";
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return "Đã có lỗi không mong muốn xảy ra";
        }
    }


}
