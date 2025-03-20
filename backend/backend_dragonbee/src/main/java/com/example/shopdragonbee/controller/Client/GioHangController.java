package com.example.shopdragonbee.controller.Client;

import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.service.Client.GioHangService;
import com.example.shopdragonbee.service.Client.SanPhamChiTietClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gioHang")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class GioHangController {

    @Autowired
    private GioHangService gioHangService;

    @PostMapping("/getListDanhSachCapNhatSoLuongSanPhamGioHang")
    public List<SPCTDTO.SanPhamCart> getListDanhSachCapNhatSoLuongSanPhamGioHang(@RequestBody List<SPCTDTO.SanPhamCart> danhSachSanPhamTrongGioHang) {
        return gioHangService.getListDanhSachCapNhatSoLuongSanPhamGioHang(danhSachSanPhamTrongGioHang);
    }

}
