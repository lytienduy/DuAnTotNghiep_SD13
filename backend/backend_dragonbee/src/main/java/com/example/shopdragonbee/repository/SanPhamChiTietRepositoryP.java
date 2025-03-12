package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SanPhamChiTietRepositoryP extends JpaRepository<SanPhamChiTiet, Integer>, JpaSpecificationExecutor<SanPhamChiTiet> {
    SanPhamChiTiet findByMa(String ma);

}
