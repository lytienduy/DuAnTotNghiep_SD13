package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.entity.PhongCach;
import com.example.shopdragonbee.dto.PhongCachDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PhongCachRepository extends JpaRepository<PhongCach, Integer> {

    @Query("SELECT new com.example.shopdragonbee.dto.PhongCachDTO(pc.id, pc.ma, pc.tenPhongCach, pc.moTa, pc.trangThai) FROM PhongCach pc")
    List<PhongCachDTO> getAll();

    @Query("SELECT MAX(pc.ma) FROM PhongCach pc")
    Optional<String> findLastCode();

    boolean existsByTenPhongCach(String tenPhongCach);

    @Query("SELECT new com.example.shopdragonbee.dto.PhongCachDTO(pc.id, pc.ma, pc.tenPhongCach, pc.moTa, pc.trangThai) " +
            "FROM PhongCach pc WHERE pc.trangThai = :trangThai")
    List<PhongCachDTO> findByTrangThai(String trangThai);
}
