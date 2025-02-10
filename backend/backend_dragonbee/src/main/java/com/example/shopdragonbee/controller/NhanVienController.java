package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.repository.DanhMucRepository;
import com.example.shopdragonbee.repository.NhanVienRepository;
import com.example.shopdragonbee.respone.DanhMucRespone;
import com.example.shopdragonbee.respone.NhanVienRespone;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/nhanvien")
@CrossOrigin(origins = "http://localhost:3000")
public class NhanVienController {

    private final NhanVienRepository nhanVienRepository;

    public NhanVienController(NhanVienRepository nhanVienRepository) {
        this.nhanVienRepository = nhanVienRepository;
    }

    // API lấy danh sách sản phẩm
    @GetMapping
    public List<NhanVienRespone> getAllNhanVien() {
        return nhanVienRepository.getAll();
    }
}
