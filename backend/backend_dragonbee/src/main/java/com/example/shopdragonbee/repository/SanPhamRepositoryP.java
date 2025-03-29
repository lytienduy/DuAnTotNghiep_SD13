package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepositoryP extends JpaRepository<SanPham, Integer> {
    List<SanPham> findSanPhamsByTrangThaiOrderByNgayTao(String trangThai);
}
