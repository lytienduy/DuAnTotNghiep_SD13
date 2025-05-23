package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.PhongCachDTO;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.entity.PhongCach;
import com.example.shopdragonbee.repository.PhongCachRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PhongCachService {

    private final PhongCachRepository phongCachRepository;

    public PhongCachService(PhongCachRepository phongCachRepository) {
        this.phongCachRepository = phongCachRepository;
    }

    public Page<PhongCachDTO> getAllPhongCachPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<PhongCach> phongCachPage = phongCachRepository.findAll(pageable);

        return phongCachPage.map(pc -> new PhongCachDTO(
                pc.getId(),
                pc.getMa(),
                pc.getTenPhongCach(),
                pc.getMoTa(),
                pc.getTrangThai()
        ));
    }
    public List<PhongCachDTO> getAllPhongCach() {
        return phongCachRepository.findAll().stream().map(pc ->
                new PhongCachDTO(pc.getId(), pc.getMa(), pc.getTenPhongCach(), pc.getMoTa(), pc.getTrangThai())
        ).collect(Collectors.toList());
    }

    @Transactional
    public ResponseEntity<?> addPhongCach(PhongCachDTO phongCachDTO) {
        if (phongCachRepository.existsByTenPhongCach(phongCachDTO.getTenPhongCach())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tên phong cách đã tồn tại!");
        }

        String newCode = generateNewCode();
        PhongCach phongCach = PhongCach.builder()
                .ma(newCode)
                .tenPhongCach(phongCachDTO.getTenPhongCach())
                .moTa(phongCachDTO.getMoTa())
                .trangThai("Hoạt động")
                .build();

        phongCachRepository.save(phongCach);
        return ResponseEntity.status(HttpStatus.CREATED).body(phongCach);
    }

    private String generateNewCode() {
        Optional<String> lastCode = phongCachRepository.findLastCode();
        if (lastCode.isPresent()) {
            String last = lastCode.get().replace("PC", "");
            int newNumber = Integer.parseInt(last) + 1;
            return "PC" + String.format("%03d", newNumber);
        } else {
            return "PC001";
        }
    }
    // show ds theo trạng thái
    public List<PhongCachDTO> getPhongCachByTrangThai(String trangThai) {
        return phongCachRepository.findByTrangThai(trangThai);
    }
}
