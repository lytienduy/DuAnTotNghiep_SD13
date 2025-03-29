package com.example.shopdragonbee.controller.Client;


import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.dto.Client.SanPhamDTO;
import com.example.shopdragonbee.service.Client.SanPhamClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spClient")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class SanPhamClientController {
    @Autowired
    private SanPhamClientService sanPhamClientService;
    //Nhập số lượng sản phẩm từ bán phím

    @GetMapping("/layListCacSanPhamHienThi")
    public List<SanPhamDTO.SanPhamClient> layListCacSanPhamHienThi(
            @RequestParam(required = false) String timKiem,
            @RequestParam(required = false) Integer fromGia,
            @RequestParam(required = false) Integer toGia,
            @RequestParam(required = false) Integer danhMuc,
            @RequestParam(required = false) Integer mauSac,
            @RequestParam(required = false) Integer chatLieu,
            @RequestParam(required = false) Integer kichCo,
            @RequestParam(required = false) Integer kieuDang,
            @RequestParam(required = false) Integer thuongHieu,
            @RequestParam(required = false) Integer phongCach
    ) {
        return sanPhamClientService.getListSanPhamTheoBoLoc(timKiem, fromGia, toGia, danhMuc, mauSac, chatLieu, kichCo, kieuDang, thuongHieu, phongCach);
    }

}
