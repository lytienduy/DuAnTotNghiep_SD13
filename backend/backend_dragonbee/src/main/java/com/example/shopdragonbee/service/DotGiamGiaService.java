package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.DotGiamGiaResponse;
import com.example.shopdragonbee.entity.DotGiamGia;
import com.example.shopdragonbee.repository.DotGiamGiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DotGiamGiaService {

    @Autowired
    private DotGiamGiaRepository repository;

    public List<DotGiamGiaResponse> getAllDotGiamGia() {
        return repository.findAll().stream().map(dot -> DotGiamGiaResponse.builder()
                .id(dot.getId())
                .maDotGiamGia(dot.getMaDotGiamGia())
                .tenDotGiamGia(dot.getTenDotGiamGia())
                .giaTriGiam(dot.getGiaTriGiam())
                .loaiDotGiamGia(dot.getLoaiDotGiamGia())
                .trangThai(dot.getTrangThai())
                .ngayBatDau(dot.getNgayBatDau())
                .ngayKetThuc(dot.getNgayKetThuc())
                .build()
        ).collect(Collectors.toList());
    }

    public Page<DotGiamGiaResponse> getAllDotGiamGiaPageable(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("ngayTao").descending());
        return repository.findAll(pageable).map(dot -> DotGiamGiaResponse.builder()
                .id(dot.getId())
                .maDotGiamGia(dot.getMaDotGiamGia())
                .tenDotGiamGia(dot.getTenDotGiamGia())
                .giaTriGiam(dot.getGiaTriGiam())
                .loaiDotGiamGia(dot.getLoaiDotGiamGia())
                .trangThai(dot.getTrangThai())
                .ngayBatDau(dot.getNgayBatDau())
                .ngayKetThuc(dot.getNgayKetThuc())
                .build()
        );
    }

}
