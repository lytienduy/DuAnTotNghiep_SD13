package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.PhongCachDTO;
import com.example.shopdragonbee.entity.PhongCach;
import com.example.shopdragonbee.service.PhongCachService;
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

    @GetMapping
    public List<PhongCachDTO> getAllPhongCach() {
        return phongCachService.getAllPhongCach();
    }
    @PostMapping("/add")
    public ResponseEntity<?> addPhongCach(@RequestBody PhongCachDTO phongCachDTO) {
        return phongCachService.addPhongCach(phongCachDTO);
    }

}
