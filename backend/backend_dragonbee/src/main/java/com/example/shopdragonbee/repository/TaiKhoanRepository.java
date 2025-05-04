package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Integer> {
    TaiKhoan findByTenNguoiDung(String tenNguoiDung);
    TaiKhoan findByTenNguoiDungAndMatKhau(String tenNguoiDung, String matKhau);
}
