package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.MauSacDTO;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.repository.MauSacRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MauSacService {

    @Autowired
    private MauSacRepository mauSacRepository;

    // show theo trạng thái
    public List<MauSacDTO> getMauSacByTrangThai(String trangThai) {
        return mauSacRepository.findByTrangThai(trangThai);
    }
}
