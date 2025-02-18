package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.XuatXuDTO;
import com.example.shopdragonbee.service.XuatXuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/xuatxu")
@CrossOrigin(origins = "http://localhost:3000")
public class XuatXuController {  // Đảm bảo từ khóa "public class" đúng

    private final XuatXuService xuatXuService;

    public XuatXuController(XuatXuService xuatXuService) {
        this.xuatXuService = xuatXuService;
    }

    // API lấy danh sách xuất xứ
    @GetMapping
    public ResponseEntity<List<XuatXuDTO>> getAllXuatSu() {
        return ResponseEntity.ok(xuatXuService.getAllXuatXu());
    }

    // API thêm xuất xứ mới
    @PostMapping("/add")
    public ResponseEntity<?> addXuatXu(@RequestBody XuatXuDTO xuatXuDTO) {
        try {
            XuatXuDTO newXuatXu = xuatXuService.addXuatXu(xuatXuDTO);
            return ResponseEntity.ok(newXuatXu);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
