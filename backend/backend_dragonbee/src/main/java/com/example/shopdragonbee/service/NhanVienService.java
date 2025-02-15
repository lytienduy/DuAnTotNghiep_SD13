package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.NhanVienRequestDTO;
import com.example.shopdragonbee.entity.NhanVien;
import com.example.shopdragonbee.entity.TaiKhoan;
import com.example.shopdragonbee.repository.NhanVienRepository;
import com.example.shopdragonbee.repository.TaiKhoanRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
public class NhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private MailService mailService;


    private static final String UPLOAD_DIR = "D:/uploads/";
    public NhanVien themMoiNhanVien(NhanVienRequestDTO dto) {
        if (nhanVienRepository.findByCccd(dto.getCccd()).isPresent()) {
            throw new RuntimeException("CCCD đã tồn tại!");
        }

        String randomPassword = RandomStringUtils.randomAlphanumeric(8);

        TaiKhoan taiKhoan = taiKhoanRepository.findById(dto.getIdTaiKhoan())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        taiKhoan.setMatKhau(randomPassword);
        taiKhoanRepository.save(taiKhoan);

        String fileName = (dto.getAnh() != null && !dto.getAnh().isEmpty()) ? saveFile(dto.getAnh()) : null;

        NhanVien nhanVien = NhanVien.builder()
                .ma(generateMaNhanVien())
                .tenNhanVien(dto.getTenNhanVien())
                .ngaySinh(dto.getNgaySinh())
                .gioiTinh(dto.getGioiTinh())
                .sdt(dto.getSdt())
                .email(dto.getEmail())
                .diaChi(dto.getFullAddress()) // Gộp địa chỉ lại trước khi lưu
                .anh(fileName)
                .cccd(dto.getCccd())
                .trangThai(dto.getTrangThai() != null ? dto.getTrangThai() : "Hoạt động")
                .ngayTao(LocalDateTime.now())
                .nguoiTao(dto.getNguoiTao())
                .taiKhoan(taiKhoan)
                .build();

        nhanVienRepository.save(nhanVien);

        // Gửi email
        String subject = "Thông tin tài khoản nhân viên";
        String body = "Xin chào " + dto.getTenNhanVien() + ",\n\n"
                + "Tài khoản của bạn đã được tạo thành công!\n"
                + "Tên đăng nhập: " + taiKhoan.getTenNguoiDung() + "\n"
                + "Mật khẩu: " + randomPassword + "\n\n"
                + "Vui lòng đổi mật khẩu sau khi đăng nhập.\n"
                + "Trân trọng!";
        mailService.sendMail(dto.getEmail(), subject, body);

        return nhanVien;
    }



    private String saveFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            return "http://localhost:8080/uploads/" + fileName; // Trả về URL ảnh
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu ảnh: " + e.getMessage());
        }
    }


    private String generateMaNhanVien() {
        String lastMa = nhanVienRepository.findLastMaNhanVien();
        int number = 1;

        if (lastMa != null && lastMa.startsWith("NV")) {
            try {
                number = Integer.parseInt(lastMa.substring(2)) + 1;
            } catch (NumberFormatException ignored) {}
        }

        return String.format("NV%03d", number);
    }


    public boolean existsByCccd(String cccd) {
        return nhanVienRepository.existsByCccd(cccd);
    }
}
