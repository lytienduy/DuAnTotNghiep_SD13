package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.PhongCachDTO;
import com.example.shopdragonbee.entity.PhongCach;
import com.example.shopdragonbee.service.PhongCachService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phongcach")
@CrossOrigin(origins = "http://localhost:3000")
public class PhongCachController {

    private final PhongCachService phongCachService;

    public PhongCachController(PhongCachService phongCachService) {
        this.phongCachService = phongCachService;
    }
    @GetMapping("/phan-trang")
    public Page<PhongCachDTO> getPhongCachPhanTrang(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size // <-- thêm dòng này
    ) {
        return phongCachService.getAllPhongCachPaged(page, size);
    }
    @GetMapping
    public List<PhongCachDTO> getAllPhongCach() {
        return phongCachService.getAllPhongCach();
    }
    @PostMapping("/add")
    public ResponseEntity<?> addPhongCach(@RequestBody PhongCachDTO phongCachDTO) {
        return phongCachService.addPhongCach(phongCachDTO);
    }
    // api ds theo trạng thái
    @GetMapping("/phong-cach/hoat-dong")
    public List<PhongCachDTO> getPhongCachByTrangThaiHoatDong() {
        return phongCachService.getPhongCachByTrangThai("Hoạt động");
    }
}
