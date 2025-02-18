package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.XuatXuDTO;
import com.example.shopdragonbee.entity.XuatXu;
import com.example.shopdragonbee.repository.XuatSuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class XuatXuService {

    private final XuatSuRepository xuatSuRepository;

    @Autowired
    public XuatXuService(XuatSuRepository xuatSuRepository) {
        this.xuatSuRepository = xuatSuRepository;
    }

    // Lấy danh sách xuất xứ
    public List<XuatXuDTO> getAllXuatXu() {
        return xuatSuRepository.getAll();
    }

    // Tạo mã xuất xứ mới theo định dạng XX + số tăng dần
    private String generateMaXuatXu() {
        String maxMa = xuatSuRepository.findMaxMa();
        if (maxMa == null || maxMa.isEmpty()) {
            return "XX001";
        }
        try {
            int number = Integer.parseInt(maxMa.replace("XX", "")) + 1;
            return String.format("XX%03d", number);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Lỗi khi tạo mã xuất xứ!");
        }
    }

    // Thêm mới xuất xứ
    @Transactional
    public XuatXuDTO addXuatXu(XuatXuDTO xuatXuDTO) {
        // Kiểm tra xem tên xuất xứ đã tồn tại hay chưa
        Optional<XuatXu> existing = xuatSuRepository.findByTenXuatXu(xuatXuDTO.getTenXuatXu());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Tên xuất xứ đã tồn tại. Vui lòng chọn tên khác.");
        }

        // Tạo mới xuất xứ
        XuatXu newXuatXu = XuatXu.builder()
                .ma(generateMaXuatXu())
                .tenXuatXu(xuatXuDTO.getTenXuatXu())
                .moTa(xuatXuDTO.getMoTa() == null ? "" : xuatXuDTO.getMoTa())
                .trangThai("Hoạt động")
                .build();

        newXuatXu = xuatSuRepository.save(newXuatXu);
        return new XuatXuDTO(newXuatXu.getId(), newXuatXu.getMa(), newXuatXu.getTenXuatXu(), newXuatXu.getMoTa(), newXuatXu.getTrangThai());
    }
}
