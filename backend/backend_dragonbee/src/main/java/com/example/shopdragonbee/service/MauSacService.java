package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.MauSacDTO;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.entity.MauSac;
import com.example.shopdragonbee.repository.MauSacRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MauSacService {

    @Autowired
    private MauSacRepository mauSacRepository;

    public Page<MauSacDTO> getAllMauSacPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<MauSac> mauSacPage = mauSacRepository.findAll(pageable);

        return mauSacPage.map(ms -> new MauSacDTO(
               ms.getId(),
                ms.getMa(),
                ms.getTenMauSac(),
                ms.getMaMau(),
                ms.getMoTa(),
                ms.getTrangThai()


        ));
    }
    // show theo trạng thái
    public List<MauSacDTO> getMauSacByTrangThai(String trangThai) {
        return mauSacRepository.findByTrangThai(trangThai);
    }

    //add màu sắc
    // Hàm tạo mã màu tự động theo định dạng MS001, MS002, ...
    public String generateColorCode() {
        Long maxId = mauSacRepository.count();
        return "MS" + String.format("%03d", maxId + 1);
    }

    public MauSac addColor(MauSac mauSac) {
        // Tạo mã màu tự động
        mauSac.setMa(generateColorCode());

        // Trạng thái mặc định là "Hoạt động"
        if (mauSac.getTrangThai() == null || mauSac.getTrangThai().isEmpty()) {
            mauSac.setTrangThai("Hoạt động");
        }

        return mauSacRepository.save(mauSac);
    }
}
