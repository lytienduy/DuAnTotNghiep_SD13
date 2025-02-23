package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.NhanVienRequestDTO;
import com.example.shopdragonbee.entity.NhanVien;
import com.example.shopdragonbee.entity.TaiKhoan;
import com.example.shopdragonbee.repository.NhanVienRepository;
import com.example.shopdragonbee.repository.TaiKhoanRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private JavaMailSender mailSender;


    private static final String UPLOAD_DIR = "E:/uploads/";

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
        String htmlContent =
                "<html>" +
                        "<head>" +
                        "<style>" +
                        "body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }" +
                        "div.container { display: flex; justify-content: center; align-items: center; background-color: #f4f4f4; padding: 20px; }" +
                        "div.content { width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 30px; text-align: center; margin: 0 auto; }" +
                        "h2 { color: #3498ea; }" +
                        "p { font-size: 16px; color: #333333; line-height: 1.6; }" +
                        ".highlight-box { background-color: #dff0d8; padding: 15px; border-radius: 8px; border: 1px solid #b2dba1; display: inline-block; font-weight: bold; margin: 15px auto; }" +
                        ".footer { font-size: 14px; color: #777777; margin-top: 20px; }" +
                        ".btn { display: inline-block; background-color: #3498ea; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 15px; }" +
                        ".btn:hover { background-color: #217dbb; }" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class='container'>" +
                        "<div class='content'>" +
                        "<div><img src='https://raw.githubusercontent.com/lytienduy/DuAnTotNghiep_SD13/refs/heads/main/frontend/dragonbee/src/img/dragonbee_logo_v1.png' alt='Logo' style='max-width: 100px; height: auto;' /></div>" +
                        "<h2>Xin chào " + dto.getTenNhanVien() + ",</h2>" +
                        "<p>Tài khoản của bạn đã được tạo thành công!</p>" +
                        "<div class='highlight-box'>" +
                        "<p><strong>Tên đăng nhập:</strong> " + taiKhoan.getTenNguoiDung() + "</p>" +
                        "<p><strong>Mật khẩu:</strong> " + randomPassword + "</p>" +
                        "</div>" +
                        "<p>Vui lòng đổi mật khẩu sau khi đăng nhập.</p>" +
                        "<p class='footer'>Cảm ơn bạn đã đồng hành cùng chúng tôi!</p>" +
                        "<p class='footer'>Mọi thắc mắc xin vui lòng liên hệ: <strong>dragonbeeshop@gmail.com</strong></p>" +
                        "</div>" +
                        "</body>" +
                        "</html>";


// Gọi dịch vụ gửi email với nội dung HTML
        mailService.sendMail(dto.getEmail(), subject, htmlContent);


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
            } catch (NumberFormatException ignored) {
            }
        }

        return String.format("NV%03d", number);
    }


    public boolean existsByCccd(String cccd) {
        return nhanVienRepository.existsByCccd(cccd);
    }

    // Phân tích dữ liệu QR thành đối tượng NhanVienRequestDTO
    public NhanVienRequestDTO parseQRCodeData(String qrData) {
        // Giả sử qrData là một chuỗi JSON, bạn cần sử dụng một thư viện JSON để phân tích
        // Cài đặt dữ liệu giả định từ qrData cho demo:
        NhanVienRequestDTO dto = new NhanVienRequestDTO();

        // Giả lập dữ liệu (thay đổi theo dữ liệu thực tế trong QR)
        dto.setCccd("1234567890");
        dto.setTenNhanVien("Nguyen Van A");
        dto.setNgaySinh(LocalDate.of(1990, 1, 1));
        dto.setGioiTinh("Nam");
        dto.setTinhThanh("Hà Nội");
        dto.setQuanHuyen("Cầu Giấy");
        dto.setXaPhuong("Dịch Vọng");
        dto.setSoNha("123 Phố X");

        return dto;
    }

    // Kiểm tra xem nhân viên đã tồn tại theo CCCD
    public boolean isNhanVienExists(String cccd) {
        return nhanVienRepository.findByCccd(cccd) != null;
    }

    @Transactional
    public String importNhanVien(MultipartFile file) {
        List<NhanVien> nhanViens = new ArrayList<>();
        try {
            InputStream inputStream = file.getInputStream();
            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Bỏ qua dòng tiêu đề

                NhanVien nv = NhanVien.builder()
                        .ma(getCellValue(row.getCell(1)))
                        .tenNhanVien(getCellValue(row.getCell(2)))
                        .email(getCellValue(row.getCell(3)))
                        .sdt(getCellValue(row.getCell(4)))
                        .ngaySinh(parseDate(row.getCell(5)))
                        .gioiTinh(getCellValue(row.getCell(6)))
                        .trangThai("Hoạt động") // Mặc định trạng thái "Hoạt động"
                        .diaChi(getCellValue(row.getCell(8))) // Lưu địa chỉ
                        .build();

                nhanViens.add(nv);
                nhanVienRepository.save(nv); // Lưu từng nhân viên để đảm bảo gửi email ngay

                // Gửi email cho nhân viên
                try {
                    mailService.sendMail(nv.getEmail(), "Chào mừng bạn đến với công ty!",
                            "Xin chào " + nv.getTenNhanVien() + ",<br><br>Chúc mừng bạn đã được thêm vào hệ thống nhân viên của chúng tôi.");
                } catch (Exception e) {
                    System.err.println("Lỗi khi gửi email: " + e.getMessage());
                }
            }
            return "Import thành công " + nhanViens.size() + " nhân viên!";
        } catch (IOException e) {
            return "Lỗi khi đọc file: " + e.getMessage();
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            default -> "";
        };
    }

    private LocalDate parseDate(Cell cell) {
        if (cell == null || cell.getCellType() != CellType.NUMERIC) return null;
        return cell.getLocalDateTimeCellValue().toLocalDate();
    }


}
