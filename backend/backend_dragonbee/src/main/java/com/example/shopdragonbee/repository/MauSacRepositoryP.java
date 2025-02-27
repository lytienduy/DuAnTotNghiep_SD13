package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.entity.MauSac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MauSacRepositoryP extends JpaRepository<MauSac, Integer> {
}
