package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiaChiRepository extends JpaRepository<DiaChi, Integer> {
}
