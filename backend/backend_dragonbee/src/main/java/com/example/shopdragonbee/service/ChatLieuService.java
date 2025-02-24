package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.ChatLieuDTO;
import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.repository.ChatLieuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatLieuService {
    private final ChatLieuRepository chatLieuRepository;

    // Lấy danh sách chất liệu
    public List<ChatLieuDTO> getAllChatLieu() {
        return chatLieuRepository.getAllChatLieu();
    }

    // Hàm tạo mã chất liệu mới
    private String generateMaChatLieu() {
        Optional<ChatLieu> lastChatLieu = chatLieuRepository.findTopByOrderByMaDesc();

        if (lastChatLieu.isPresent()) {
            String lastMa = lastChatLieu.get().getMa();

            // Kiểm tra nếu mã hợp lệ (phải bắt đầu bằng "CL" và có số phía sau)
            if (lastMa != null && lastMa.matches("CL\\d+")) {
                int number = Integer.parseInt(lastMa.substring(2)) + 1;
                return String.format("CL%03d", number);
            }
        }

        return "CL001"; // Nếu không tìm thấy mã hợp lệ, bắt đầu từ CL001
    }



    // Hàm thêm chất liệu
    public ChatLieu addChatLieu(String tenChatLieu, String moTa) {
        if (chatLieuRepository.existsByTenChatLieu(tenChatLieu)) {
            throw new RuntimeException("Tên chất liệu đã tồn tại!");
        }

        String newMa = generateMaChatLieu();
        ChatLieu newChatLieu = ChatLieu.builder()
                .ma(newMa)
                .tenChatLieu(tenChatLieu)
                .moTa(moTa)
                .trangThai("Hoạt động")
                .build();

        ChatLieu savedChatLieu = chatLieuRepository.save(newChatLieu);
        log.info("Thêm chất liệu thành công: {}", savedChatLieu);
        return savedChatLieu;
    }
    // show ds theo trạng thái
    public List<ChatLieuDTO> getChatLieuByTrangThai(String trangThai) {
        return chatLieuRepository.findByTrangThai(trangThai);
    }
}
