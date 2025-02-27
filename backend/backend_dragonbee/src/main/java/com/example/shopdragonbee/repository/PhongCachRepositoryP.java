package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.PhongCach;
import com.example.shopdragonbee.entity.ThuongHieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhongCachRepositoryP extends JpaRepository<PhongCach, Integer> {
}
