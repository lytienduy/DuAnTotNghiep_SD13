package com.example.shopdragonbee.dto;

import com.example.shopdragonbee.entity.ChatLieu;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ChatLieuDTO {
    private Integer id;
    private String ma;
    private String tenChatLieu;
    private String moTa;
    private String trangThai;

    public ChatLieuDTO(ChatLieu chatLieu) {
        this.id = chatLieu.getId();
        this.ma = chatLieu.getMa();
        this.tenChatLieu = chatLieu.getTenChatLieu();
        this.moTa = chatLieu.getMoTa();
        this.trangThai = chatLieu.getTrangThai();
    }

    public ChatLieuDTO() {
    }

    public ChatLieuDTO(Integer id, String tenChatLieu) {
        this.id = id;
        this.tenChatLieu = tenChatLieu;
    }
}
