//package com.example.shopdragonbee.controller;
//
//import com.example.shopdragonbee.entity.TaiKhoan;
//import com.example.shopdragonbee.service.TaiKhoanService;
//import com.example.shopdragonbee.util.JwtUtil;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/auth")
//@CrossOrigin(origins = "http://localhost:3000")
//public class AuthController {
//
//    private final TaiKhoanService taiKhoanService;
//    private final AuthenticationManager authenticationManager;
//    private final JwtUtil jwtUtil;
//
//    public AuthController(TaiKhoanService taiKhoanService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
//        this.taiKhoanService = taiKhoanService;
//        this.authenticationManager = authenticationManager;
//        this.jwtUtil = jwtUtil;
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestParam String tenNguoiDung, @RequestParam String matKhau) {
//        Optional<TaiKhoan> taiKhoanOptional = taiKhoanService.findByTenNguoiDung(tenNguoiDung);
//        if (taiKhoanOptional.isPresent() && taiKhoanService.checkPassword(taiKhoanOptional.get(), matKhau)) {
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(tenNguoiDung, matKhau));
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//
//            String token = jwtUtil.generateToken(tenNguoiDung);
//            return ResponseEntity.ok(token);
//        }
//        return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
//    }
//
//}
