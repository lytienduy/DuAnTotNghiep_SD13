package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.RegisterRequest;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.NhanVien;
import com.example.shopdragonbee.entity.VaiTro;
import com.example.shopdragonbee.repository.KhachHangRepository;
import com.example.shopdragonbee.repository.TaiKhoanRepository;
import com.example.shopdragonbee.repository.VaiTroRepository;
import com.example.shopdragonbee.respone.JwtResponse;
import com.example.shopdragonbee.security.JwtTokenProvider;
import com.example.shopdragonbee.entity.TaiKhoan;
import com.example.shopdragonbee.service.TaiKhoanService;
import lombok.AllArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

// Định nghĩa DTO cho login
class LoginRequest {
    private String username;
    private String password;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private TaiKhoanService taiKhoanService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private VaiTroRepository vaiTroRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    // Cập nhật phương thức đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        TaiKhoan taiKhoan = taiKhoanService.findByUsernameAndPassword(username, password);
        if (taiKhoan == null) {
            return ResponseEntity.status(401).body("Có gì đó không đúng!");
        }

        // Generate tokens
        String token = jwtTokenProvider.generateToken(taiKhoan.getTenNguoiDung());
        String refreshToken = jwtTokenProvider.generateRefreshToken(taiKhoan.getTenNguoiDung());

        // Return tokens in response
        return ResponseEntity.ok(new JwtResponse(token, refreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestParam String refreshToken) {
        if (jwtTokenProvider.validateToken(refreshToken)) {
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            String newToken = jwtTokenProvider.generateToken(username);
            return ResponseEntity.ok(new JwtResponse(newToken, refreshToken));
        } else {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }
    }

    // API để lấy thông tin người dùng và vai trò
    @GetMapping("/userInfo")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {
        try {
            // Lấy username từ token
            String username = jwtTokenProvider.getUsernameFromToken(token.substring(7));  // Loại bỏ "Bearer " ở đầu token

            // Tìm tài khoản người dùng
            TaiKhoan taiKhoan = taiKhoanService.findByUsername(username);

            if (taiKhoan == null) {
                return ResponseEntity.status(401).body("User not found");
            }

            // Kiểm tra vai trò của người dùng
            Integer roleId = taiKhoan.getVaiTro().getId();

            // Tạo một đối tượng để trả về thông tin người dùng + vai trò
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("tenNguoiDung", taiKhoan.getTenNguoiDung());
            userInfo.put("vaiTro", taiKhoan.getVaiTro());  // Trả về thông tin vai trò
            userInfo.put("ngayTao", taiKhoan.getNgayTao());

            // Kiểm tra người dùng là khách hàng hay nhân viên
            if (roleId == 1 || roleId == 2) {
                // Nếu là nhân viên hay admin, lấy thông tin nhân viên
                NhanVien nhanVien = taiKhoan.getNhanVien();  // Lấy thông tin nhân viên từ TaiKhoan
                userInfo.put("nhanVien", nhanVien);  // Trả về thông tin nhân viên
                return ResponseEntity.ok(userInfo);
            } else if (roleId == 3) {
                // Nếu là khách hàng, lấy thông tin khách hàng
                KhachHang khachHang = taiKhoan.getKhachHang();  // Lấy thông tin khách hàng từ TaiKhoan
                userInfo.put("khachHang", khachHang);  // Trả về thông tin khách hàng
                return ResponseEntity.ok(userInfo);
            }

            return ResponseEntity.status(403).body("Access denied");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Invalid token");
        }
    }

    private String generateCustomerCode() {
        // Lấy mã khách hàng lớn nhất hiện tại từ CSDL
        Integer maxMa = khachHangRepository.getMaxMa();

        // Nếu chưa có khách hàng nào, bắt đầu từ KH0001
        int newCode = (maxMa == null) ? 1 : maxMa + 1;

        // Tính độ dài của số để đảm bảo định dạng đúng
        int length = String.format("%d", newCode).length();

        // Đảm bảo mã khách hàng có đủ số chữ số, ví dụ KH000001, KH000002,...
        return String.format("KH%0" + (4) + "d", newCode);  // Chắc chắn rằng số có 6 chữ số
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Check email tồn tại trong KhachHang
        if (khachHangRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email này đã được đăng ký");
        }

        // Kiểm tra xác nhận mật khẩu
        if (!request.getMatKhau().equals(request.getXacNhanMatKhau())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Mật khẩu và xác nhận mật khẩu không khớp");
        }

        // Tạo tài khoản
        VaiTro vaiTroKhachHang = vaiTroRepository.findById(3);
        if (vaiTroKhachHang == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không tìm thấy vai trò khách hàng");
        }

        TaiKhoan taiKhoan = TaiKhoan.builder()
                .tenNguoiDung(request.getEmail())
                .matKhau(request.getMatKhau()) // Bạn nên mã hóa mật khẩu ở đây nếu có
                .vaiTro(vaiTroKhachHang)
                .trangThai("Hoạt động")
                .ngayTao(LocalDateTime.now())
                .nguoiTao("Đăng ký")
                .build();

        taiKhoan = taiKhoanRepository.save(taiKhoan);

        // Tạo khách hàng
        KhachHang khachHang = KhachHang.builder()
                .tenKhachHang(request.getTenKhachHang())
                .email(request.getEmail())
                .ma(generateCustomerCode()) // Sinh mã tự động
                .taiKhoan(taiKhoan)
                .trangThai("Hoạt động")
                .ngayTao(LocalDateTime.now())
                .nguoiTao("Đăng ký")
                .build();

        khachHangRepository.save(khachHang);

        return ResponseEntity.ok("Đăng ký thành công");
    }

}
