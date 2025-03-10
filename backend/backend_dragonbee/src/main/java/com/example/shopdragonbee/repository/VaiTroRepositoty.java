package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VaiTroRepositoty extends JpaRepository<VaiTro, Integer> {
    Optional<VaiTro> findByMa(String ma);
}
