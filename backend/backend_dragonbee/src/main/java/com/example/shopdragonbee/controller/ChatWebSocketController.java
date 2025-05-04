package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.ChatKhachHangDTO;
import com.example.shopdragonbee.dto.ChatMessageDTO;
import com.example.shopdragonbee.dto.ChatMessageRequestDTO;
import com.example.shopdragonbee.entity.ChatMessage;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.NhanVien;
import com.example.shopdragonbee.repository.ChatMessageRepository;
import com.example.shopdragonbee.repository.KhachHangRepository;
import com.example.shopdragonbee.repository.NhanVienRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.UUID;


@RestController
public class ChatWebSocketController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @MessageMapping("/chat/send")
    @SendTo("/topic/messages")
    public ChatMessageDTO sendMessage(ChatMessageRequestDTO request) {
        ChatMessage message = new ChatMessage();
        message.setNoiDung(request.getNoiDung());
        message.setThoiGian(LocalDateTime.now());
        message.setGuiTuNhanVien(request.getGuiTuNhanVien());

        // ✅ Luôn set khách hàng (bất kể ai gửi)
        khachHangRepository.findById(request.getIdKhachHang())
                .ifPresent(message::setKhachHang);

        if (request.getGuiTuNhanVien()) {
            // Nếu là nhân viên gửi thì thêm nhân viên
            nhanVienRepository.findById(request.getIdNhanVien())
                    .ifPresent(message::setNhanVien);
        }

        if (!request.getGuiTuNhanVien()) {
            message.setDaDoc(false); // khách gửi, chưa đọc
        } else {
            message.setDaDoc(true); // nhân viên gửi, không cần xử lý unread
        }

        chatMessageRepository.save(message);

        ChatMessageDTO dto = new ChatMessageDTO();
        BeanUtils.copyProperties(message, dto);

        if (message.getNhanVien() != null) {
            dto.setIdNhanVien(message.getNhanVien().getId());
            dto.setTenNhanVien(message.getNhanVien().getTenNhanVien());
        }

        if (message.getKhachHang() != null) {
            dto.setIdKhachHang(message.getKhachHang().getId());
        }

        return dto;
    }

    @GetMapping("/api/chat/messages/{idKhachHang}")
    public List<ChatMessageDTO> getMessages(@PathVariable Integer idKhachHang) {
        List<ChatMessage> messages = chatMessageRepository.findByKhachHang_Id(idKhachHang);

        return messages.stream().map(msg -> {
            ChatMessageDTO dto = new ChatMessageDTO();
            dto.setIdKhachHang(msg.getKhachHang().getId());
            if (msg.getNhanVien() != null) {
                dto.setIdNhanVien(msg.getNhanVien().getId());
            }
            dto.setGuiTuNhanVien(msg.getGuiTuNhanVien());
            dto.setNoiDung(msg.getNoiDung());
            dto.setThoiGian(msg.getThoiGian());

            if (msg.getGuiTuNhanVien() && msg.getNhanVien() != null) {
                dto.setTenNhanVien(msg.getNhanVien().getTenNhanVien());
            }

            return dto;
        }).collect(Collectors.toList());
    }


    @GetMapping("/api/chat/clients")
    public List<ChatKhachHangDTO> getClientsChatted() {
        return chatMessageRepository.findClientsWithLastMessageFull();
    }

    @PutMapping("/api/chat/markAsRead/{idKhachHang}")
    public void markMessagesAsRead(@PathVariable Integer idKhachHang) {
        List<ChatMessage> messages = chatMessageRepository.findByKhachHang_IdAndGuiTuNhanVienFalseAndDaDocFalse(idKhachHang);
        messages.forEach(msg -> msg.setDaDoc(true));
        chatMessageRepository.saveAll(messages);
    }

    @PostMapping("/api/chat/upload")
    public Map<String, String> uploadChatImage(@RequestParam("file") MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get("E:/uploads");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // ✅ Không có /chat trong URL nữa
        String fileUrl = "http://localhost:8080/uploads/" + fileName;

        return Map.of("url", fileUrl);
    }


}

