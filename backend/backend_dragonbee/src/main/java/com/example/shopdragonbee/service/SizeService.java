package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.SizeDTO;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.entity.Size;
import com.example.shopdragonbee.repository.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SizeService {

    @Autowired
    private SizeRepository sizeRepository;

    public Page<SizeDTO> getAllSizePaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Size> sizePage = sizeRepository.findAll(pageable);

        return sizePage.map(ss -> new SizeDTO(
                ss.getId(),
                ss.getMa(),
                ss.getTenSize(),
                ss.getMoTa(),
                ss.getTrangThai()
        ));
    }
    // show theo trạng thái
    public List<SizeDTO> getSizeByTrangThai(String trangThai) {
        return sizeRepository.findByTrangThai(trangThai);
    }

    // Hàm tạo mã size tự động
    private String generateSizeCode() {
        Optional<Size> lastSize = sizeRepository.findAll().stream()
                .reduce((first, second) -> second); // Lấy phần tử cuối cùng
        int nextCode = lastSize.map(size -> Integer.parseInt(size.getMa().substring(2)) + 1)
                .orElse(1); // Nếu không có dữ liệu thì bắt đầu từ SZ001
        return String.format("SZ%03d", nextCode);
    }

    // Thêm mới size
    public Size addSize(SizeDTO sizeDTO) {
        String generatedCode = generateSizeCode();
        Size newSize = new Size();
        newSize.setMa(generatedCode);
        newSize.setTenSize(sizeDTO.getTenSize() == null ? "Mặc định" : sizeDTO.getTenSize());
        newSize.setMoTa(sizeDTO.getMoTa() == null ? "Mô tả mặc định" : sizeDTO.getMoTa());
        newSize.setTrangThai(sizeDTO.getTrangThai() == null ? "Hoạt động" : sizeDTO.getTrangThai());

        return sizeRepository.save(newSize);
    }
}
