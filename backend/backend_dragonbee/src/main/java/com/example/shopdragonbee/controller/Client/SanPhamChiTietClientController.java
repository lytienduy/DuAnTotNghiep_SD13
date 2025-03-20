package com.example.shopdragonbee.controller.Client;

import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.service.Client.SanPhamChiTietClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spctClient")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class SanPhamChiTietClientController {
    @Autowired
    private SanPhamChiTietClientService sanPhamChiTietService;

    @PostMapping("/getListSanPhamChiTietTheoMau/{idSanPham}")
    public SPCTDTO.SanPhamChiTietClient getListHienThiTrongSanPhamChiTiet(@PathVariable Integer idSanPham, @RequestBody List<SPCTDTO.SanPhamCart> danhSachSanPhamTrongGioHang) {
        return sanPhamChiTietService.getSanPhamChiTietClient(idSanPham,danhSachSanPhamTrongGioHang);
    }

//    @GetMapping("/getListSanPhamChiTietTheoMau/{idSanPham}")
//    public SPCTDTO.SanPhamChiTietClient getListHienThiTrongSanPhamChiTiet(@PathVariable Integer idSanPham,@RequestBody List<ProductDTO> products) {
//        return sanPhamChiTietService.getListSizeDeUpdateKhiChonMau(idSanPham,products);
//    }
}
