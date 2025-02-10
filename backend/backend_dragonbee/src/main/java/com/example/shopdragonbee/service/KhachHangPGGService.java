package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.KhachHangPGGResponse;
import com.example.shopdragonbee.repository.KhachHangPGGRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class KhachHangPGGService {

    @Autowired
    private KhachHangPGGRepository khachHangPGGRepository;

    public Page<KhachHangPGGResponse> searchKhachHang(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return khachHangPGGRepository.getKhachHangList(pageable); // Trả về tất cả khách hàng nếu không nhập keyword
        }
        return khachHangPGGRepository.searchKhachHang(keyword, pageable);
    }

}
