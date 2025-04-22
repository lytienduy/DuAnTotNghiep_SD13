package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.ChatLieuDTO;
import com.example.shopdragonbee.dto.PhongCachDTO;
import com.example.shopdragonbee.dto.SanPhamDTO;
import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.service.ChatLieuService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatlieu")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ChatLieuController {
    private final ChatLieuService chatLieuService;
    private  final ChatLieuRepository chatLieuRepository;

    // lấy tất cả chất liệu
    @GetMapping("/all")
    public ResponseEntity<List<ChatLieuDTO>> getAllChatLieu() {
        return ResponseEntity.ok(chatLieuService.getAllChatLieu());
    }

    // API lấy danh sách chất liệu
    @GetMapping
    public ResponseEntity<Page<ChatLieuDTO>> getAllChatLieu(
            @RequestParam(defaultValue = "0") int page,  // Mặc định là trang 0
            @RequestParam(defaultValue = "5") int size)  // Mặc định là 5 phần tử mỗi trang
    {
        // Gọi service để lấy dữ liệu phân trang
        Page<ChatLieuDTO> result = chatLieuService.getChatLieuPaginated(page, size);
        return ResponseEntity.ok(result);
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
    // api ds theo trạng thái
    @GetMapping("/chat-lieu/hoat-dong")
    public List<ChatLieuDTO> getChatLieuByTrangThaiHoatDong() {
        return chatLieuService.getChatLieuByTrangThai("Hoạt động");
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ChatLieuDTO>> searchChatLieu(
            @RequestParam(required = false) String tenChatLieu,
            @RequestParam(required = false, defaultValue = "") String trangThai,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
            Pageable pageable = PageRequest.of(page, size);

        Page<ChatLieuDTO> result = chatLieuService.searchChatLieu(tenChatLieu, trangThai, pageable);

        return ResponseEntity.ok(result);

    }

    // chuyển trạng thái
    @PutMapping("/doi-trang-thai/{id}")
    public ResponseEntity<ChatLieuDTO> doiTrangThai(@PathVariable Integer id) {
        ChatLieuDTO updated = chatLieuService.toggleTrangThai(id);
        return ResponseEntity.ok(updated);
    }

    // cập nhật chất liệu
    @PutMapping("/cap-nhat/{id}")
    public ResponseEntity<?> capNhatChatLieu(@PathVariable Integer id, @RequestBody ChatLieuDTO dto) {
        Optional<ChatLieu> optionalChatLieu = chatLieuRepository.findById(id);
        if (!optionalChatLieu.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        ChatLieu chatLieu = optionalChatLieu.get();
        chatLieu.setTenChatLieu(dto.getTenChatLieu());
        chatLieu.setMoTa(dto.getMoTa());
        chatLieu.setTrangThai(dto.getTrangThai());

        chatLieuRepository.save(chatLieu);
        return ResponseEntity.ok(new ChatLieuDTO(chatLieu));
    }
}
