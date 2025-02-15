package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.KhachHangDto;
import com.example.shopdragonbee.entity.DiaChi;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.TaiKhoan;
import com.example.shopdragonbee.repository.DiaChiRepository;
import com.example.shopdragonbee.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class KhachHangService {
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private DiaChiRepository diaChiRepository;

    @Autowired
    private TaiKhoanService taiKhoanService;

    public List<KhachHangDto> getAllKhachHang() {
        List<KhachHangDto> khachHangDtoList = new ArrayList<>();
        khachHangRepository.findAll().forEach(khachHang -> {
            khachHangDtoList.add(mapToDto(khachHang));
        });
        return khachHangDtoList;
    }

    public KhachHangDto updateKhachHang(String ma, KhachHangDto khachHangDto) {
        KhachHang khachHang = khachHangRepository.findKhachHangByMa(ma);
        DiaChi diaChi = khachHang.getDiaChis().get(0);
        diaChi.setSoNha(khachHangDto.getDiaChiDto().getSoNha());
        diaChi.setDuong(khachHangDto.getDiaChiDto().getDuong());
        diaChi.setXa(khachHangDto.getDiaChiDto().getXa());
        diaChi.setHuyen(khachHangDto.getDiaChiDto().getHuyen());
        diaChi.setThanhPho(khachHangDto.getDiaChiDto().getThanhPho());
        diaChiRepository.save(diaChi);

        khachHang.setTenKhachHang(khachHangDto.getTenKhachHang());
        khachHang.setEmail(khachHangDto.getEmail());
        khachHang.setSdt(khachHangDto.getSdt());
        khachHang.setNgaySinh(khachHangDto.getNgaySinh());
        khachHang.setGioiTinh(khachHangDto.getGioiTinh());
        KhachHang updatedKhachHang = khachHangRepository.save(khachHang);
        return mapToDto(updatedKhachHang);
    }

    public KhachHangDto mapToDto(KhachHang khachHang) {
        return new KhachHangDto(khachHang.getMa(), khachHang.getTenKhachHang(), khachHang.getEmail(), khachHang.getNgaySinh(), khachHang.getGioiTinh(), khachHang.getSdt(), khachHang.getTrangThai(), DiaChiService.mapToDto(khachHang.getDiaChis().get(0)));
    }

    public KhachHang mapToEntity(KhachHangDto khachHangDto) {
        KhachHang khachHang = new KhachHang();
        khachHang.setTenKhachHang(khachHangDto.getTenKhachHang());
        khachHang.setEmail(khachHangDto.getEmail());
        khachHang.setSdt(khachHangDto.getSdt());
        khachHang.setNgaySinh(khachHangDto.getNgaySinh());
        khachHang.setGioiTinh(khachHangDto.getGioiTinh());
        return khachHang;
    }

    public KhachHangDto addKhachHang(KhachHangDto khachHangDto) {
        List<KhachHang> khachHangs = khachHangRepository.findAll();
        KhachHang khachHang = mapToEntity(khachHangDto);
        khachHang.setTrangThai("Hoạt động");
        String ma = "KH00";
        if(khachHangs.size() > 10){
            ma = "KH0";
        }
        if(khachHangs.size() > 100){
            ma = "KH";
        }
        khachHang.setMa(ma + (khachHangs.size() + 1));
        TaiKhoan taiKhoan = taiKhoanService.taoTKKhachHang(khachHangDto);
        khachHang.setTaiKhoan(taiKhoan);
        KhachHang kh = khachHangRepository.save(khachHang);

        DiaChi diaChi = new DiaChi();
        diaChi.setSoNha(khachHangDto.getDiaChiDto().getSoNha());
        diaChi.setDuong(khachHangDto.getDiaChiDto().getDuong());
        diaChi.setXa(khachHangDto.getDiaChiDto().getXa());
        diaChi.setHuyen(khachHangDto.getDiaChiDto().getHuyen());
        diaChi.setThanhPho(khachHangDto.getDiaChiDto().getThanhPho());
        diaChi.setKhachHang(khachHang);
        diaChiRepository.save(diaChi);

        kh.setDiaChis(List.of(diaChi));

        return mapToDto(kh);
    }
}
