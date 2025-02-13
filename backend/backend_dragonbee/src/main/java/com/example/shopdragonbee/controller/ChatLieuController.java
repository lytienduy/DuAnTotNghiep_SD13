package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.respone.ChatLieuRespone;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatlieu")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatLieuController {

    private final ChatLieuRepository chatLieuRepository;

    public ChatLieuController(ChatLieuRepository chatLieuRepository) {
        this.chatLieuRepository = chatLieuRepository;
    }

    // API lấy danh sách chất liệu
    @GetMapping
    public List<ChatLieuRespone> getAllChatLieu() {
        return chatLieuRepository.getAll();
    }

    // API thêm chất liệu
    @PostMapping("/add_cl")
    public ResponseEntity<?> addChatLieu(@RequestBody ChatLieu newChatLieu) {

        // Validate các trường không được để trống (trừ mô tả)
        if (newChatLieu.getMa() == null || newChatLieu.getMa().trim().isEmpty()) {
            return new ResponseEntity<>("Mã chất liệu không được để trống!", HttpStatus.BAD_REQUEST);
        }

        if (newChatLieu.getTenChatLieu() == null || newChatLieu.getTenChatLieu().trim().isEmpty()) {
            return new ResponseEntity<>("Tên chất liệu không được để trống!", HttpStatus.BAD_REQUEST);
        }

        if (newChatLieu.getTrangThai() == null || newChatLieu.getTrangThai().trim().isEmpty()) {
            return new ResponseEntity<>("Trạng thái không được để trống!", HttpStatus.BAD_REQUEST);
        }

        // Lưu chất liệu mới vào cơ sở dữ liệu
        ChatLieu savedChatLieu = chatLieuRepository.save(newChatLieu);

        // Trả về phản hồi thành công với đối tượng đã lưu
        return new ResponseEntity<>(savedChatLieu, HttpStatus.CREATED);
    }
}
