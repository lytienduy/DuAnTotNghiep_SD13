package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.dto.ChatLieuDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatLieuRepository extends JpaRepository<ChatLieu, Integer> {

    @Query("""
        select new com.example.shopdragonbee.dto.ChatLieuDTO(
            cl.id,
            cl.ma,
            cl.tenChatLieu,
            cl.moTa,
            cl.trangThai
        )
        from ChatLieu cl
    """)
    List<ChatLieuDTO> getAllChatLieu();

    Optional<ChatLieu> findTopByOrderByMaDesc(); // Tìm mã lớn nhất

    boolean existsByTenChatLieu(String tenChatLieu);

    @Query("SELECT new com.example.shopdragonbee.dto.ChatLieuDTO(cl.id, cl.ma, cl.tenChatLieu, cl.moTa, cl.trangThai) " +
            "FROM ChatLieu cl WHERE cl.trangThai = :trangThai")
    List<ChatLieuDTO> findByTrangThai(String trangThai);
}
