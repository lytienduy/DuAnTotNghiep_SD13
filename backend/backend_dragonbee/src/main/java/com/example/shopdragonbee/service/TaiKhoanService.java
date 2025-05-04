package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.KhachHangDto;
import com.example.shopdragonbee.entity.TaiKhoan;
import com.example.shopdragonbee.entity.VaiTro;
import com.example.shopdragonbee.repository.TaiKhoanRepository;
import com.example.shopdragonbee.repository.VaiTroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Optional;

@Service
public class TaiKhoanService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private VaiTroRepository vaiTroRepository;

    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(chars.length());
            password.append(chars.charAt(index));
        }

        return password.toString();
    }

    public TaiKhoan taoTKKhachHang(KhachHangDto khachHangDto){
        VaiTro vaiTro = vaiTroRepository.findVaiTroByTenVaiTro("Khách hàng");
        TaiKhoan taiKhoan = new TaiKhoan();
        taiKhoan.setVaiTro(vaiTro);
        taiKhoan.setTenNguoiDung(khachHangDto.getEmail());
        taiKhoan.setMatKhau(generateRandomPassword(8));
        taiKhoan.setTrangThai("Hoạt động");
        taiKhoan.setNguoiTao("admin");
        taiKhoanRepository.save(taiKhoan);
        return taiKhoan;
    }

    public TaiKhoan findByUsernameAndPassword(String username, String password) {
        return taiKhoanRepository.findByTenNguoiDungAndMatKhau(username, password);
    }
    public TaiKhoan findByUsername(String username) {
        return taiKhoanRepository.findByTenNguoiDung(username);
    }
}
