package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.repository.SanPhamRepository;
import com.example.shopdragonbee.respone.ChatLieuRespone;
import com.example.shopdragonbee.respone.SanPhamRespone;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chatlieu")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatLieuController {


    private final ChatLieuRepository chatLieuRepository;

    public ChatLieuController(ChatLieuRepository chatLieuRepository) {
        this.chatLieuRepository = chatLieuRepository;
    }

    // API lấy danh sách sản phẩm
    @GetMapping
    public List<ChatLieuRespone> getAllChatLieu() {
        return chatLieuRepository.getAll();
    }
}
