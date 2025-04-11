package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    // Tìm tất cả tin nhắn của 1 khách hàng theo ID
    List<ChatMessage> findByKhachHang_Id(Integer idKhachHang);

    @Query("SELECT DISTINCT c.khachHang.id FROM ChatMessage c WHERE c.khachHang IS NOT NULL")

    List<Integer> findDistinctKhachHangIds();
    @Query("""
    SELECT c.khachHang.id 
    FROM ChatMessage c 
    WHERE c.khachHang IS NOT NULL 
    GROUP BY c.khachHang.id 
    ORDER BY MAX(c.thoiGian) DESC
""")
    List<Integer> findKhachHangIdsOrderByLastMessageTimeDesc();


}
