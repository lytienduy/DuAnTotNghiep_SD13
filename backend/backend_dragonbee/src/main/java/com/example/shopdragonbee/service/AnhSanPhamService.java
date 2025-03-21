package com.example.shopdragonbee.service;

import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.AnhSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnhSanPhamService {

    @Autowired
    private AnhSanPhamRepository anhSanPhamRepository;

    public List<AnhSanPham> getAllAnhBySanPhamChiTietId(Integer sanPhamChiTietId) {
        return anhSanPhamRepository.findBySanPhamChiTietId(sanPhamChiTietId);
    }

    public List<AnhSanPham> addAnhsToSanPhamChiTiet(Integer sanPhamChiTietId, List<AnhSanPham> anhSanPhamList) {
        // Lấy danh sách ảnh hiện tại để tính toán mã ảnh tiếp theo
        List<AnhSanPham> existingAnhs = anhSanPhamRepository.findBySanPhamChiTietId(sanPhamChiTietId);
        int nextImageNumber = existingAnhs.size() + 1;

        List<AnhSanPham> savedAnhs = new ArrayList<>();

        for (AnhSanPham anh : anhSanPhamList) {
            // Tự động tạo mã ảnh theo định dạng IMG001, IMG002, ...
            String ma = String.format("IMG%03d", nextImageNumber);
            anh.setMa(ma);
            anh.setTrangThai("Hoạt động"); // Mặc định trạng thái là "Hoạt động"
            anh.setSanPhamChiTiet(SanPhamChiTiet.builder().id(sanPhamChiTietId).build()); // Gán đúng id_san_pham_chi_tiet

            // Lưu ảnh mới
            anhSanPhamRepository.save(anh);
            savedAnhs.add(anh);  // Thêm ảnh mới vào danh sách lưu lại

            nextImageNumber++;
        }

        // Trả về danh sách ảnh mới vừa thêm vào (savedAnhs)
        return savedAnhs;
    }


}
