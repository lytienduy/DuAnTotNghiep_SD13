package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VaiTroRepository extends JpaRepository<VaiTro, Integer> {
    VaiTro findVaiTroByTenVaiTro(String tenVaiTro);

}
