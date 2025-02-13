package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hoa-don")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép gọi API từ frontend
public class HoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

    @GetMapping("/loc-theo-loai-don-va-trang-thai")
    public List<HoaDonResponseDTO> locTheoLoaiDonVaTrangThai(@RequestParam(value = "loaiDon", required = false) String loaiDon,
                                                             @RequestParam(value = "trangThai", required = false) String trangThai) {

        if ("all".equalsIgnoreCase(loaiDon) && trangThai.equalsIgnoreCase("TatCaTrangThai")) {
            return hoaDonService.getAllHoaDons();
        } else if ("all".equalsIgnoreCase(loaiDon) == false && trangThai.equalsIgnoreCase("TatCaTrangThai")) {
            return hoaDonService.timKiemTheoLoaiDon(loaiDon);
        } else if ("all".equalsIgnoreCase(loaiDon) == false && trangThai.equalsIgnoreCase("TatCaTrangThai") == false) {
            return hoaDonService.timKiemTheoTrangThaiAndLoaiDon(trangThai, loaiDon);
        } else if ("all".equalsIgnoreCase(loaiDon) && trangThai.equalsIgnoreCase("TatCaTrangThai") == false) {
            return hoaDonService.timKiemTheoTrangThai(trangThai);
        } else {
            return hoaDonService.getAllHoaDons();
        }
    }

    @GetMapping("/hoa-don-chi-tiet/{id}")
    public List<HoaDonResponseDTO> locTheoLoaiDonVaTrangThai(@PathVariable Integer id) {

    }

    //    @GetMapping("/{ma}")
//    public ResponseEntity<HoaDon> getHoaDonByMa(@PathVariable String ma) {
//        Optional<HoaDon> hoaDon = hoaDonService.getHoaDonByMa(ma);
//        return hoaDon.map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }
//    List<Integer> list1 = Arrays.asList(1, 2, 3, 4, 5);
//    List<Integer> list2 = Arrays.asList(3, 4, 5, 6, 7);
//
//    Set<Integer> set = new HashSet<>(list1);
//    List<Integer> commonElements = list2.stream()
//            .filter(set::contains)
//            .collect(Collectors.toList());
//
//        System.out.println("Các phần tử chung: " + commonElements); // Output: [3, 4, 5]
    @GetMapping
    public List<HoaDonResponseDTO> getHoaDons() {
        return hoaDonService.getAllHoaDons();
    }

}
