package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.entity.GioHang;
import com.example.shopdragonbee.entity.GioHangChiTiet;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.GioHangChiTietRepository;
import com.example.shopdragonbee.repository.GioHangRepository;
import com.example.shopdragonbee.repository.KhachHangRepository;
import com.example.shopdragonbee.repository.SanPhamChiTietRepositoryP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GioHangService {
    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;
    @Autowired
    private GioHangRepository gioHangRepository;
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private GioHangChiTietRepository gioHangChiTietRepository;


    //P
    public List<SPCTDTO.SanPhamCart> getListDanhSachCapNhatSoLuongSanPhamGioHang(List<SPCTDTO.SanPhamCart> listDanhSachSanPhamCart) {
        for (SPCTDTO.SanPhamCart sanPhamCart : listDanhSachSanPhamCart
        ) {
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepositoryP.findById(sanPhamCart.getIdSPCT()).get();
            if (sanPhamChiTiet.getSoLuong() - sanPhamCart.getQuantity() <= 0) {
                if (sanPhamChiTiet.getSoLuong() <= 0) {
                    sanPhamCart.setQuantity(0);
                } else {
                    sanPhamCart.setQuantity(sanPhamChiTiet.getSoLuong());
                }
            }
            //Cập nhật giá
            if (sanPhamChiTiet.getGia() != sanPhamCart.getGia()) {
                sanPhamCart.setGia(sanPhamChiTiet.getGia());
            }
        }
        return listDanhSachSanPhamCart;
    }

    //P
    public List<SPCTDTO.SanPhamCart> getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang(List<SPCTDTO.SanPhamCart> listDanhSachSanPhamCart) {
        for (SPCTDTO.SanPhamCart sanPhamCart : listDanhSachSanPhamCart
        ) {
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepositoryP.findById(sanPhamCart.getIdSPCT()).get();
            sanPhamCart.setQuantity(sanPhamChiTiet.getSoLuong() - sanPhamCart.getQuantity());
        }
        return listDanhSachSanPhamCart;
    }

    public Boolean addVaoGioHang(Integer idSanPhamChiTiet, Integer soLuong, Double gia, Integer idKhachHang) {
        try {
            KhachHang khachHang = khachHangRepository.findById(idKhachHang).get();
            //Kiểm tra khách hàng đã có giỏ hàng chưa
            GioHang gioHang = gioHangRepository.getGioHangByKhachHang(khachHang);
            if (gioHang == null) {//Nếu chưa thì tạo
                GioHang gioHangKhoiTao = new GioHang();
                gioHangKhoiTao.setMa("GH" + (System.currentTimeMillis() % 100000));
                gioHang.setKhachHang(khachHang);
                gioHang.setNgayTao(LocalDateTime.now());
                gioHangRepository.save(gioHangKhoiTao);
                gioHang = gioHangRepository.getGioHangByKhachHang(khachHang);//set với giỏ hàng mới
            }
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepositoryP.findById(idSanPhamChiTiet).get();
            //Kiểm tra đã có sản phẩm trong giỏ hàng chưa
            GioHangChiTiet gioHangChiTiet = gioHangChiTietRepository.findBySanPhamChiTietAndGioHang(sanPhamChiTiet, gioHang);
            if (gioHangChiTiet == null) {//Nếu chưa thì tạo
                GioHangChiTiet gioHangChiTiet1 = new GioHangChiTiet();
                gioHangChiTiet1.setMa("GHCT" + (System.currentTimeMillis() % 100000));
                gioHangChiTiet1.setGioHang(gioHang);
                gioHangChiTiet1.setSanPhamChiTiet(sanPhamChiTiet);
                gioHangChiTiet1.setSoLuong(soLuong);
                gioHangChiTiet1.setGia(gia);
                gioHangChiTiet1.setNgayTao(LocalDateTime.now());
                gioHangChiTietRepository.save(gioHangChiTiet1);
            } else {//Nếu có rồi thì cộng thêm số lượng
                gioHangChiTiet.setSoLuong(gioHangChiTiet.getSoLuong() + soLuong);
                gioHangChiTietRepository.save(gioHangChiTiet);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
