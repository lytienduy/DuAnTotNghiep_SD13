package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.SanPhamChiTietRepositoryP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GioHangService {
    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;


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


}
