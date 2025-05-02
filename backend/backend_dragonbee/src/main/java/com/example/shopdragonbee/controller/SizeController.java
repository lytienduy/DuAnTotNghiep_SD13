package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.MauSacDTO;
import com.example.shopdragonbee.dto.SizeDTO;
import com.example.shopdragonbee.entity.Size;
import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.repository.SizeRepository;
import com.example.shopdragonbee.respone.ChatLieuRespone;
import com.example.shopdragonbee.respone.SizeRespone;
import com.example.shopdragonbee.service.SizeService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/size")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SizeController {

    private final SizeRepository sizeRepository;
    private final SizeService sizeService;


    @GetMapping("/phan-trang")
    public Page<SizeDTO> getSizePhanTrang(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size // <-- thêm dòng này
    ) {
        return sizeService.getAllSizePaged(page, size);
    }
    // API lấy danh sách sản phẩm
    @GetMapping
    public List<SizeRespone> getAllSize() {
        return sizeRepository.getAll();
    }

    @GetMapping("/hoat-dong")
    public List<SizeDTO> getSizeTrangThaiHoatDong() {
        return sizeService.getSizeByTrangThai("Hoạt động");
    }
    // add size
    @PostMapping("/add-size")
    public ResponseEntity<Size> addSize(@RequestBody SizeDTO sizeDTO) {
        Size addedSize = sizeService.addSize(sizeDTO);
        return new ResponseEntity<>(addedSize, HttpStatus.CREATED);
    }
}
