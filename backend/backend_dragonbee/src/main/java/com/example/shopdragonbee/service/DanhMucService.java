package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.repository.DanhMucRepository;
import com.example.shopdragonbee.respone.DanhMucRespone;
import com.example.shopdragonbee.respone.DanhMucRespone2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DanhMucService {

    private final DanhMucRepository danhMucRepository;

    public DanhMucService(DanhMucRepository danhMucRepository) {
        this.danhMucRepository = danhMucRepository;
    }

    // lấy danh sách phân trang
    public Page<DanhMucDTO> getAllDanhMucPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<DanhMuc> danhMucPage = danhMucRepository.findAll(pageable);

        return danhMucPage.map(dm -> new DanhMucDTO(
                dm.getId(),
                dm.getMa(),
                dm.getTenDanhMuc(),
                dm.getMoTa(),
                dm.getTrangThai()
        ));
    }
    // Lấy danh sách danh mục
    public List<DanhMucRespone> getAllDanhMuc() {
        return danhMucRepository.getAll();
    }

    // Lấy danh sách danh mục (loại 2)
    public List<DanhMucRespone2> getAllDanhMucSimple() {
        return danhMucRepository.getAllDanhMuc();
    }

    // Tạo mã danh mục mới theo format "DMxxx"
    private String generateMaDanhMuc() {
        String lastCode = danhMucRepository.findMaxMaDanhMuc();
        if (lastCode == null) {
            return "DM001";
        }
        int number = Integer.parseInt(lastCode.substring(2)) + 1;
        return String.format("DM%03d", number);
    }

    // Thêm danh mục mới
    @Transactional
    public DanhMuc addDanhMuc(DanhMucDTO danhMucDTO) {
        // Kiểm tra xem tên danh mục đã tồn tại chưa
        Optional<DanhMuc> existingCategory = danhMucRepository.findByTenDanhMuc(danhMucDTO.getTenDanhMuc());
        if (existingCategory.isPresent()) {
            throw new RuntimeException("Tên danh mục đã tồn tại!");
        }

        DanhMuc danhMuc = DanhMuc.builder()
                .ma(generateMaDanhMuc())
                .tenDanhMuc(danhMucDTO.getTenDanhMuc())
                .moTa(danhMucDTO.getMoTa())
                .trangThai("Hoạt động") // Mặc định trạng thái là "Hoạt động"
                .build();

        return danhMucRepository.save(danhMuc);
    }
    // show ds theo trạng thái
    public List<DanhMucDTO> getDanhMucByTrangThai(String trangThai) {
        return danhMucRepository.findByTrangThai(trangThai);
    }
}
