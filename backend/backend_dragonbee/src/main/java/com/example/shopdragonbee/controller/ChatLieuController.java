package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.ChatLieuDTO;
import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.service.ChatLieuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chatlieu")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ChatLieuController {
    private final ChatLieuService chatLieuService;

    // API lấy danh sách chất liệu
    @GetMapping
    public ResponseEntity<List<ChatLieuDTO>> getAllChatLieu() {
        return ResponseEntity.ok(chatLieuService.getAllChatLieu());
    }

    // API thêm chất liệu mới
    @PostMapping("/add")
    public ResponseEntity<?> addChatLieu(@RequestBody Map<String, String> request) {
        try {
            String tenChatLieu = request.get("tenChatLieu");
            String moTa = request.getOrDefault("moTa", ""); // Mặc định rỗng nếu không có

            ChatLieu newChatLieu = chatLieuService.addChatLieu(tenChatLieu, moTa);
            return ResponseEntity.ok(new ChatLieuDTO(newChatLieu));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
