package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.KhachHangDto;
import com.example.shopdragonbee.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/khach-hang")
@CrossOrigin(origins = "http://localhost:3000")
public class KhachHangController {
    @Autowired
    private KhachHangService khachHangService;

    @GetMapping("/")
    public List<KhachHangDto> getAllKhachHang() {
        return khachHangService.getAllKhachHang();
    }

    @GetMapping("/{ma}")
    public KhachHangDto getKhachHangByMa(@PathVariable String ma) {
        return khachHangService.getAllKhachHang().stream().filter(khachHangDto -> khachHangDto.getMa().equals(ma)).findFirst().get();
    }

    @PutMapping("/{ma}")
    public KhachHangDto updateKhachHang(@PathVariable String ma, @RequestBody KhachHangDto khachHangDto) {
        return khachHangService.updateKhachHang(ma, khachHangDto);
    }

    @PostMapping("/")
    public KhachHangDto addKhachHang(@RequestBody KhachHangDto khachHangDto) {
        return khachHangService.addKhachHang(khachHangDto);
    }
}
