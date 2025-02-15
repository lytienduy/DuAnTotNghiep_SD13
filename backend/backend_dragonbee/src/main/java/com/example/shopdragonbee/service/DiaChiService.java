package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.DiaChiDto;
import com.example.shopdragonbee.entity.DiaChi;
import org.springframework.stereotype.Service;

@Service
public class DiaChiService {
    public static DiaChiDto mapToDto(DiaChi diaChi) {
        return new DiaChiDto(diaChi.getId(), diaChi.getSoNha(), diaChi.getDuong(), diaChi.getXa(), diaChi.getHuyen(), diaChi.getThanhPho(), diaChi.getMoTa(), diaChi.getTrangThai(), diaChi.getMacDinh());
    }
}
