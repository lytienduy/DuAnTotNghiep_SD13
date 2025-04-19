package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.ChatKhachHangDTO;
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

//    @Query("""
//    SELECT new com.example.shopdragonbee.dto.ChatKhachHangDTO(
//        kh.id,
//        kh.tenKhachHang,
//        MAX(cm.thoiGian),
//        MAX(cm.noiDung),
//        SUM(CASE WHEN cm.guiTuNhanVien = false AND cm.daDoc = false THEN 1 ELSE 0 END)
//    )
//    FROM ChatMessage cm
//    JOIN cm.khachHang kh
//    GROUP BY kh.id, kh.tenKhachHang
//    ORDER BY MAX(cm.thoiGian) DESC
//""")
//    List<ChatKhachHangDTO> findClientsWithLastMessageAndUnread();

    @Query("""
    SELECT new com.example.shopdragonbee.dto.ChatKhachHangDTO(
        kh.id,
        kh.tenKhachHang,
        cm.thoiGian,
        cm.noiDung,
        cm.guiTuNhanVien,
        (SELECT COUNT(c2) 
         FROM ChatMessage c2 
         WHERE c2.khachHang.id = kh.id 
           AND c2.guiTuNhanVien = false 
           AND c2.daDoc = false)
    )
    FROM ChatMessage cm
    JOIN cm.khachHang kh
    WHERE cm.thoiGian = (
        SELECT MAX(c2.thoiGian) 
        FROM ChatMessage c2 
        WHERE c2.khachHang.id = kh.id
    )
    ORDER BY cm.thoiGian DESC
""")
    List<ChatKhachHangDTO> findClientsWithLastMessageFull();

    List<ChatMessage> findByKhachHang_IdAndGuiTuNhanVienFalseAndDaDocFalse(Integer idKhachHang);
}
