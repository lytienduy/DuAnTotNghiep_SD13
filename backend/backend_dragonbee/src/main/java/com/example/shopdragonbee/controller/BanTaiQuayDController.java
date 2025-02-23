package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.KhachHangBTQDTO;
import com.example.shopdragonbee.dto.PhieuGiamGiaDTO;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.service.KhachHangService;
import com.example.shopdragonbee.service.PhieuGiamGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dragonbee")
@CrossOrigin(origins = "http://localhost:3000")
public class BanTaiQuayDController {

    @Autowired
    private KhachHangService khachHangService;

    @Autowired
    private PhieuGiamGiaService phieuGiamGiaService;

    @GetMapping("/tim-kiem-khach-hang")
    public List<KhachHangBTQDTO> timKiemKhachHang(@RequestParam String keyword) {
        // Lấy danh sách khách hàng từ service
        List<KhachHang> khachHangs = khachHangService.timKiemKhachHang(keyword);

        // Chuyển sang DTO để trả về cho client
        return khachHangs.stream()
                .limit(5)
                .map(KhachHangBTQDTO::new)
                .collect(Collectors.toList());
    }

    //tìm phiếu giảm giá
    @GetMapping("/tim-kiem-phieu-giam-gia")
    public List<PhieuGiamGiaDTO> timKiemPhieuGiamGia(
            @RequestParam String keyword,
            @RequestParam(required = false) Integer idKhachHang) {

        // Lấy danh sách phiếu giảm giá từ service
        List<PhieuGiamGia> phieuGiamGias = phieuGiamGiaService.timKiemPhieuGiamGia(keyword, idKhachHang);

        // Chuyển danh sách phiếu giảm giá thành DTO để trả về client
        return phieuGiamGias.stream()
                .map(PhieuGiamGiaDTO::new)
                .collect(Collectors.toList());
    }
}
