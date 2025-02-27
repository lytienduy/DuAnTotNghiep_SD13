package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeRepositoryP extends JpaRepository<Size, Integer> {
}
