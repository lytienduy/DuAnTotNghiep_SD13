package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.KieuDangDTO;
import com.example.shopdragonbee.entity.KieuDang;
import com.example.shopdragonbee.repository.KieuDangRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KieuDangService {

    private final KieuDangRepository kieuDangRepository;

    public KieuDangService(KieuDangRepository kieuDangRepository) {
        this.kieuDangRepository = kieuDangRepository;
    }

    // API lấy danh sách kiểu dáng
    public List<KieuDangDTO> getAllKieuDang() {
        return kieuDangRepository.getAll();
    }

    // API thêm kiểu dáng
    public String addKieuDang(KieuDangDTO kieuDangDTO) {
        // Kiểm tra tên kiểu dáng đã tồn tại trong database chưa
        Optional<KieuDang> existingKieuDang = kieuDangRepository.findByTenKieuDang(kieuDangDTO.getTenKieuDang());
        if (existingKieuDang.isPresent()) {
            return "Tên kiểu dáng đã tồn tại";
        }

        // Tạo đối tượng kiểu dáng mới từ DTO
        KieuDang newKieuDang = KieuDang.builder()
                .ma("KD" + (kieuDangRepository.count() + 1))  // Tạo mã kiểu dáng tự động
                .tenKieuDang(kieuDangDTO.getTenKieuDang())
                .moTa(kieuDangDTO.getMoTa())
                .trangThai("Hoạt động")  // Trạng thái mặc định là Hoạt động
                .build();

        // Lưu kiểu dáng mới vào database
        kieuDangRepository.save(newKieuDang);

        return "Thêm kiểu dáng thành công";
    }
}
