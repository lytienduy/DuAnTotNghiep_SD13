package com.example.shopdragonbee.controller.Client;

import com.example.shopdragonbee.dto.Client.ThanhToanDTO;
import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.service.Client.ThanhToanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/thanhToanClient")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ThanhToanController {
    @Autowired
    ThanhToanService thanhToanService;

    @PostMapping("/xacNhanDatHang")
    public String xacNhanDatHang(@RequestBody ThanhToanDTO request) {
        return thanhToanService.xacNhanDatHang(
                request.getMaHoaDon(),
                request.getPgg(),
                request.getTenNguoiNhan(),
                request.getSdtNguoiNhan(),
                request.getEmailNguoiNhan(),
                request.getDiaChiNhanHang(),
                Float.parseFloat(request.getTongTienPhaiTra()),
                Float.parseFloat(request.getPhiShip()),
                request.getGhiChu(),
                request.getDanhSachThanhToan(),
                request.getIdKhachHang()
        );
    }


}
