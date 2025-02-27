package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.DanhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DanhMucRepositoryP extends JpaRepository<DanhMuc, Integer> {
}
