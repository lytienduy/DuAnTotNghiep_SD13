package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.KieuDaiQuanDTO;
import com.example.shopdragonbee.entity.KieuDaiQuan;
import com.example.shopdragonbee.repository.KieuDaiQuanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KieuDaiQuanService {

    private final KieuDaiQuanRepository kieuDaiQuanRepository;

//    public KieuDaiQuanService(KieuDaiQuanRepository kieuDaiQuanRepository) {
//        this.kieuDaiQuanRepository = kieuDaiQuanRepository;
//    }
    public KieuDaiQuanService(KieuDaiQuanRepository kieuDaiQuanRepository){
        this.kieuDaiQuanRepository = kieuDaiQuanRepository;
    }
    // Lấy tất cả kiểu đai quần và chuyển đổi thành DTO
    public List<KieuDaiQuanDTO> getAllKieuDaiQuan() {
        return kieuDaiQuanRepository.getAll();
    }

    // Kiểm tra tên kiểu đai quần có bị trùng không
    public boolean isNameExist(String name) {
        return kieuDaiQuanRepository.existsByTenKieuDaiQuan(name);
    }

    // Sinh mã kiểu đai quần mới
    public String generateNewMa() {
        Optional<String> maxId = kieuDaiQuanRepository.findMaxId();
        String newId = "KD001"; // default if no records
        if (maxId.isPresent()) {
            String currentMaxId = maxId.get();
            int number = Integer.parseInt(currentMaxId.replace("KD", ""));
            newId = "KD" + String.format("%03d", number + 1);
        }
        return newId;
    }

    // Thêm kiểu đai quần mới với trạng thái mặc định là "Hoạt động"
    public KieuDaiQuanDTO addKieuDaiQuan(KieuDaiQuanDTO kieuDaiQuanDTO) {
        // Kiểm tra tên kiểu đai quần đã tồn tại chưa
        if (isNameExist(kieuDaiQuanDTO.getTenKieuDaiQuan())) {
            // Không cần ném Exception nữa
            throw new IllegalArgumentException("Tên kiểu đai quần đã tồn tại.");
        }

        // Tiếp tục với các bước còn lại
        KieuDaiQuan newKieuDaiQuan = new KieuDaiQuan();
        newKieuDaiQuan.setMa(generateNewMa()); // Sinh mã tự động
        newKieuDaiQuan.setTenKieuDaiQuan(kieuDaiQuanDTO.getTenKieuDaiQuan());
        newKieuDaiQuan.setMoTa(kieuDaiQuanDTO.getMoTa());
        newKieuDaiQuan.setTrangThai("Hoạt động"); // Gán trạng thái mặc định là "Hoạt động"

        // Lưu vào database
        kieuDaiQuanRepository.save(newKieuDaiQuan);

        // Trả về DTO của đối tượng mới
        return new KieuDaiQuanDTO(newKieuDaiQuan.getId(), newKieuDaiQuan.getMa(),
                newKieuDaiQuan.getTenKieuDaiQuan(), newKieuDaiQuan.getMoTa(), newKieuDaiQuan.getTrangThai());
    }

}