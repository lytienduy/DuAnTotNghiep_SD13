package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.KhachHangPGGResponse;
import com.example.shopdragonbee.repository.KhachHangPGGRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class KhachHangPGGService {

    @Autowired
    private KhachHangPGGRepository khachHangPGGRepository;

    public List<KhachHangPGGResponse> searchKhachHang(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return khachHangPGGRepository.getKhachHangList(); // Trả về tất cả
        }
        return khachHangPGGRepository.searchKhachHang(keyword);
    }

}
