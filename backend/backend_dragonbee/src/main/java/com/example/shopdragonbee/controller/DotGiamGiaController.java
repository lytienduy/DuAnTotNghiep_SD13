package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.DotGiamGiaResponse;
import com.example.shopdragonbee.dto.SanPhamChiTietResponse;
import com.example.shopdragonbee.dto.SanPhamSoLuongDTO;
import com.example.shopdragonbee.entity.DotGiamGia;
import com.example.shopdragonbee.repository.SanPhamChiTietRepository;
import com.example.shopdragonbee.repository.SanPhamRepository;
import com.example.shopdragonbee.service.DotGiamGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dot-giam-gia")
@CrossOrigin("*") // Cho phép frontend gọi API
public class DotGiamGiaController {

    @Autowired
    private DotGiamGiaService service;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private SanPhamChiTietRepository spctRepository;

    @GetMapping("/{ids}/chi-tiet")
    public ResponseEntity<List<SanPhamChiTietResponse>> getChiTietBySanPhamIds(@PathVariable("ids") List<Integer> ids) {
        List<SanPhamChiTietResponse> result = spctRepository.findChiTietBySanPhamIds(ids);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/tong-so-luong")
    public List<SanPhamSoLuongDTO> getSanPhamWithTongSoLuong(@RequestParam(required = false) String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            return sanPhamRepository.findByMaOrTenSanPhamContaining(keyword);
        }
        return sanPhamRepository.findAllSanPhamWithTongSoLuong();
    }

    @GetMapping
    public ResponseEntity<Page<DotGiamGiaResponse>> getAllDotGiamGia(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<DotGiamGiaResponse> result = service.getAllDotGiamGiaPageable(page, size);
        return ResponseEntity.ok(result);
    }

}
