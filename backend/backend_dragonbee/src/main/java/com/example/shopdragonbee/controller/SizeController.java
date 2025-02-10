package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.repository.SizeRepository;
import com.example.shopdragonbee.respone.ChatLieuRespone;
import com.example.shopdragonbee.respone.SizeRespone;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/size")
@CrossOrigin(origins = "http://localhost:3000")
public class SizeController {

    private final SizeRepository sizeRepository;

    public SizeController(SizeRepository sizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    // API lấy danh sách sản phẩm
    @GetMapping
    public List<SizeRespone> getAllSize() {
        return sizeRepository.getAll();
    }
}
