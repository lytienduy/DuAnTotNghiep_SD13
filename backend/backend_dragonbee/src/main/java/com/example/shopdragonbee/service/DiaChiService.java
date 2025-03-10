package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.DiaChiDto;
import com.example.shopdragonbee.entity.DiaChi;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.repository.DiaChiRepository;
import com.example.shopdragonbee.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DiaChiService {
    @Autowired
    private DiaChiRepository diaChiRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    public static DiaChiDto mapToDto(DiaChi diaChi) {
        return new DiaChiDto(diaChi.getId(), diaChi.getSoNha(), diaChi.getDuong(), diaChi.getXa(), diaChi.getHuyen(), diaChi.getThanhPho(), diaChi.getMoTa(), diaChi.getTrangThai(), diaChi.getMacDinh());
    }

    public void deleteDiaChi(Integer id) {
        diaChiRepository.deleteById(id);
    }

    public void setMacDinh(Integer id) {
        DiaChi diaChi = diaChiRepository.findById(id).orElse(null);
        if (diaChi != null) {
            diaChi.setMacDinh(true);
            diaChiRepository.save(diaChi);
        }

        KhachHang khachHang = diaChi.getKhachHang();
        khachHang.getDiaChis().forEach(diaChi1 -> {
            if (!diaChi1.getId().equals(id)) {
                diaChi1.setMacDinh(false);
                diaChiRepository.save(diaChi1);
            }
        });
    }

    //Thêm địa chỉ trong bán tại quầy
    public void themDiaChi(DiaChi diaChi) {
        // Kiểm tra xem khách hàng có tồn tại hay không
        KhachHang khachHang = khachHangRepository.findById(diaChi.getKhachHang().getId())
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        // Gán khách hàng vào địa chỉ
        diaChi.setKhachHang(khachHang);

        // Lưu địa chỉ vào cơ sở dữ liệu
        diaChiRepository.save(diaChi);
    }

}
