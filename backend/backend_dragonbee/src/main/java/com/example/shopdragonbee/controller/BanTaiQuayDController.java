package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.KhachHangBTQDTO;
import com.example.shopdragonbee.dto.PhieuGiamGiaDTO;
import com.example.shopdragonbee.entity.DiaChi;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.service.DiaChiService;
import com.example.shopdragonbee.service.KhachHangService;
import com.example.shopdragonbee.service.PhieuGiamGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    private DiaChiService diaChiService;

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

    @PostMapping("/them-dia-chi")
    public ResponseEntity<String> themDiaChi(@RequestBody DiaChi diaChi) {
        try {
            diaChiService.themDiaChi(diaChi);  // Gọi service để thêm địa chỉ vào cơ sở dữ liệu
            return ResponseEntity.ok("Thêm địa chỉ thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Có lỗi khi thêm địa chỉ: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra khi thêm địa chỉ.");
        }
    }

    // API để lấy danh sách địa chỉ của khách hàng theo customerId
    @GetMapping("/danh-sach-dia-chi")
    public List<DiaChi> layDiaChi(@RequestParam Integer customerId) {
        try {
            // Gọi service để lấy danh sách địa chỉ của khách hàng
            return diaChiService.layDiaChiTheoKhachHang(customerId);
        } catch (Exception e) {
            throw new RuntimeException("Có lỗi khi lấy danh sách địa chỉ: " + e.getMessage());
        }
    }
}
