package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.repository.KieuDaiQuanRepository;
import com.example.shopdragonbee.repository.XuatSuRepository;
import com.example.shopdragonbee.respone.KieuDaiQuanRespone;
import com.example.shopdragonbee.respone.XuatSuRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/xuatxu")
@CrossOrigin(origins = "http://localhost:3000")
public class XuatSuController {


    private final XuatSuRepository xuatSuRepository;

    public XuatSuController(XuatSuRepository xuatSuRepository) {
        this.xuatSuRepository = xuatSuRepository;
    }

    // API lấy danh sách sản phẩm
    @GetMapping
    public List<XuatSuRespone> getAllXuatSu() {
        return xuatSuRepository.getAll();
    }
}
