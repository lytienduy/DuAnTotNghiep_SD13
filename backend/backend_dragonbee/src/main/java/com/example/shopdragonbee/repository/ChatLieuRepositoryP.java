package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.entity.MauSac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatLieuRepositoryP extends JpaRepository<ChatLieu, Integer> {
}
