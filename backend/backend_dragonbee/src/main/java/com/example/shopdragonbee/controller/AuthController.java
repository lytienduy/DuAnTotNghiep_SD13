package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.NhanVien;
import com.example.shopdragonbee.respone.JwtResponse;
import com.example.shopdragonbee.security.JwtTokenProvider;
import com.example.shopdragonbee.entity.TaiKhoan;
import com.example.shopdragonbee.service.TaiKhoanService;
import lombok.AllArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // Cập nhật phương thức đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        TaiKhoan taiKhoan = taiKhoanService.findByUsernameAndPassword(username, password);
        if (taiKhoan == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
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

}
