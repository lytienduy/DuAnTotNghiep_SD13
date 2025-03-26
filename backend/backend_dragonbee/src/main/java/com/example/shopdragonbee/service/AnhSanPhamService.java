package com.example.shopdragonbee.service;

import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.AnhSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    //xóa
    public boolean deleteAnhSanPham(Integer id) {
        Optional<AnhSanPham> anhSanPham = anhSanPhamRepository.findById(id);
        if (anhSanPham.isPresent()) {
            anhSanPhamRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // tạo mã
    private static int counter = 1; // Bắt đầu từ MA001

    // Phương thức tạo mã ảnh tự động
    public static String generateAnhCode() {
        // Đảm bảo rằng mã luôn có 3 chữ số (có thể thay đổi theo yêu cầu)
        return "MA" + String.format("%03d", counter++);
    }

}
