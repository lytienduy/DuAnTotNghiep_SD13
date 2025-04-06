package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hoa-don")
// Cho phép gọi API từ frontend
//@CrossOrigin(origins = "*")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class HoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

    @GetMapping("/loc")
    public List<HoaDonResponseDTO> filterInvoices(
            @RequestParam(required = false) String timKiem,
            @RequestParam(required = false) String tuNgay,
            @RequestParam(required = false) String denNgay,
            @RequestParam(required = false) String loaiDon,
            @RequestParam(required = false) String trangThai) {
        List<HoaDonResponseDTO> hoaDons = hoaDonService.locHoaDon(timKiem, tuNgay, denNgay, loaiDon, trangThai);
        return hoaDons;
    }

    @GetMapping("/count")
    public List<Integer> getHoaDonCount( @RequestParam(required = false) String timKiem,
                                         @RequestParam(required = false) String tuNgay,
                                         @RequestParam(required = false) String denNgay,
                                         @RequestParam(required = false) String loaiDon
                                         ) {
        List<Integer> countMap = hoaDonService.laySoLuongHoaDonTrangThaiVaHoaDon(timKiem, tuNgay, denNgay, loaiDon);
        return countMap;
    }

    @GetMapping("/{id}")
    public HoaDonChiTietResponseDTO.HoaDonChiTietDTO getHoaDonById(@PathVariable Integer id) {
        return hoaDonService.getHoaDonById(id);
    }


    @PostMapping("/cap-nhat-trang-thai-hoa-don/{id}")
    public Boolean capNhatTrangThaiHoaDon(@PathVariable Integer id,  @RequestBody Map<String, String> body) {
        String lyDo = body.get("lyDo");
        String trangThai = body.get("trangThai");
        String hanhDong = body.get("hanhDong");
        return hoaDonService.capNhatTrangThaiHoaDon(id, trangThai, hanhDong,lyDo);
    }

    @GetMapping
    public List<HoaDonResponseDTO> getHoaDons() {
        return hoaDonService.getAllHoaDons();
    }

}
