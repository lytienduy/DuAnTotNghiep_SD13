package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.respone.DanhMucRespone;
import com.example.shopdragonbee.respone.DanhMucRespone2;
import com.example.shopdragonbee.service.DanhMucService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/danhmuc")
@CrossOrigin(origins = "*")
public class DanhMucController {

    private final DanhMucService danhMucService;

    public DanhMucController(DanhMucService danhMucService) {
        this.danhMucService = danhMucService;
    }

    // API lấy danh sách danh mục
    @GetMapping
    public List<DanhMucRespone> getAll() {
        return danhMucService.getAllDanhMuc();
    }

    // API phân trang, mỗi trang 5 phần tử, mặc định trang 0
    @GetMapping("/phan-trang")
    public Page<DanhMucDTO> getDanhMucPhanTrang(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size // <-- thêm dòng này
    ) {
        return danhMucService.getAllDanhMucPaged(page, size);
    }

    @GetMapping("/dm2")
    public List<DanhMucRespone2> getAllDanhMuc() {
        return danhMucService.getAllDanhMucSimple();
    }

    // API thêm danh mục mới
    @PostMapping("/add")
    public ResponseEntity<?> addDanhMuc(@RequestBody DanhMucDTO danhMucDTO) {
        try {
            DanhMuc newDanhMuc = danhMucService.addDanhMuc(danhMucDTO);
            return ResponseEntity.ok(newDanhMuc);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // api ds theo trạng thái
    @GetMapping("/danh-muc/hoat-dong")
    public List<DanhMucDTO> getDanhMucByTrangThaiHoatDong() {
        return danhMucService.getDanhMucByTrangThai("Hoạt động");
    }
}
