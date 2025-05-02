package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.entity.ThuongHieu;
import com.example.shopdragonbee.repository.ThuongHieuRepository;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThuongHieuService {

    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    public Page<ThuongHieuDTO> getAllThuongHieuPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<ThuongHieu> thuongHieuPage = thuongHieuRepository.findAll(pageable);

        return thuongHieuPage.map(th -> new ThuongHieuDTO(
                th.getId(),
                th.getMa(),
                th.getTenThuongHieu(),
                th.getMoTa(),
                th.getTrangThai()
        ));
    }
    // Lấy danh sách tất cả thương hiệu
    public List<ThuongHieuDTO> getAllThuongHieu() {
        return thuongHieuRepository.getAll();
    }

    // Thêm mới thương hiệu
    public ResponseEntity<?> addThuongHieu(String tenThuongHieu, String moTa) {
        // Kiểm tra tên thương hiệu đã tồn tại trong database
        if (thuongHieuRepository.existsByTenThuongHieu(tenThuongHieu)) {
            return new ResponseEntity<>("Tên thương hiệu đã tồn tại!", HttpStatus.BAD_REQUEST);
        }

        // Tạo mã thương hiệu tự động
        String newMa = generateMaThuongHieu();

        // Tạo đối tượng thương hiệu mới
        ThuongHieu thuongHieu = ThuongHieu.builder()
                .ma(newMa)
                .tenThuongHieu(tenThuongHieu)
                .moTa(moTa)
                .trangThai("Hoạt động")
                .build();

        // Lưu thương hiệu vào cơ sở dữ liệu
        ThuongHieu savedThuongHieu = thuongHieuRepository.save(thuongHieu);

        // Trả về DTO của thương hiệu đã lưu
        return new ResponseEntity<>(new ThuongHieuDTO(savedThuongHieu.getId(), savedThuongHieu.getMa(),
                savedThuongHieu.getTenThuongHieu(), savedThuongHieu.getMoTa(), savedThuongHieu.getTrangThai()), HttpStatus.CREATED);
    }

    // Tạo mã thương hiệu tự động
    private String generateMaThuongHieu() {
        Integer maxMa = thuongHieuRepository.findMaxMa();  // Lấy mã lớn nhất hiện tại trong DB
        int newMa = (maxMa != null ? maxMa : 0) + 1;
        return "TH" + String.format("%03d", newMa);
    }
    // show theo trạng thái
    public List<ThuongHieuDTO> getThuongHieuByTrangThai(String trangThai) {
        return thuongHieuRepository.findByTrangThai(trangThai);
    }
}
