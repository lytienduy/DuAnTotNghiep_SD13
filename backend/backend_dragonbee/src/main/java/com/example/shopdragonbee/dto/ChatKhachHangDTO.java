package com.example.shopdragonbee.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatKhachHangDTO {
    private Integer id;
    private String tenKhachHang;
    private LocalDateTime lastMessageTime;
    private String lastMessage;
    private Boolean guiTuNhanVien;
    private Boolean unread;

    public ChatKhachHangDTO() {}

    public ChatKhachHangDTO(Integer id, String tenKhachHang) {
        this.id = id;
        this.tenKhachHang = tenKhachHang;
    }

    public ChatKhachHangDTO(Integer id, String tenKhachHang, LocalDateTime lastMessageTime, String lastMessage, Boolean guiTuNhanVien, long unreadCount) {
        this.id = id;
        this.tenKhachHang = tenKhachHang;
        this.lastMessageTime = lastMessageTime;
        this.lastMessage = lastMessage;
        this.guiTuNhanVien = guiTuNhanVien;
        this.unread = unreadCount > 0;
    }

}



