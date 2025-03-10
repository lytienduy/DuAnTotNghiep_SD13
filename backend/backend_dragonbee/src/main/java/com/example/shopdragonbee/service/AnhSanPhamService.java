package com.example.shopdragonbee.service;

import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.repository.AnhSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnhSanPhamService {

    @Autowired
    private AnhSanPhamRepository anhSanPhamRepository;

    // Phương thức lấy tất cả ảnh của sản phẩm chi tiết theo ID
    public List<AnhSanPham> getAllAnhBySanPhamChiTietId(Integer sanPhamChiTietId) {
        return anhSanPhamRepository.findBySanPhamChiTietId(sanPhamChiTietId);
    }

    // Thêm nhiều ảnh cho sản phẩm chi tiết
    public List<AnhSanPham> addAnhsToSanPhamChiTiet(Integer sanPhamChiTietId, List<AnhSanPham> anhSanPhamList) {
        // Lógica thêm ảnh
        return anhSanPhamRepository.saveAll(anhSanPhamList);
    }
}
