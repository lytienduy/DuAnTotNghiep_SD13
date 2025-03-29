package com.example.shopdragonbee.controller.Client;

import com.example.shopdragonbee.dto.Client.DonMuaDTO;
import com.example.shopdragonbee.dto.Client.ThanhToanDTO;
import com.example.shopdragonbee.service.Client.DonMuaService;
import com.example.shopdragonbee.service.Client.ThanhToanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
    @RequestMapping("/donMua")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DonMuaController {

    @Autowired
    private DonMuaService donMuaService;

    @GetMapping("/getDonMuaTheoTrangThaiVaKhachHang")
    public List<DonMuaDTO.HoaDonClient> xacNhanDatHangKhongDangNhap(@RequestParam String trangThai,
                                                                    @RequestParam(required = false) Integer idKhachHang) {
        return donMuaService.layHoaDonTheoTrangThaiVaKhachHang(
                trangThai, idKhachHang
        );
    }
}
