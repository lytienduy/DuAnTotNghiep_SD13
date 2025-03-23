//package com.example.shopdragonbee.service;
//
//import com.example.shopdragonbee.entity.TaiKhoan;
//import com.example.shopdragonbee.repository.TaiKhoanRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.Collections;
//
//@Service
//@RequiredArgsConstructor
//public class CustomUserDetailsService implements UserDetailsService {
//
//    private final TaiKhoanRepository taiKhoanRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        TaiKhoan user = taiKhoanRepository.findByTenNguoiDung(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
//
//        return User.builder()
//                .username(user.getTenNguoiDung())
//                .password(user.getMatKhau())
//                .roles(user.getRoleName().replace("ROLE_", "")) // Trả về "ADMIN" hoặc "CLIENT"
//                .build();
//    }
//
//}
