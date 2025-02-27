package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.KieuDang;
import com.example.shopdragonbee.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KieuDangRepositoryP extends JpaRepository<KieuDang, Integer> {
}
