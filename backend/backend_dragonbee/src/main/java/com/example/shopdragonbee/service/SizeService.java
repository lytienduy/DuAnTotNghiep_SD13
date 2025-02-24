package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.SizeDTO;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.repository.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SizeService {

    @Autowired
    private SizeRepository sizeRepository;

    // show theo trạng thái
    public List<SizeDTO> getSizeByTrangThai(String trangThai) {
        return sizeRepository.findByTrangThai(trangThai);
    }
}
