package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.KieuDang;
import com.example.shopdragonbee.entity.ThuongHieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThuongHieuRepositoryP extends JpaRepository<ThuongHieu, Integer> {
}
