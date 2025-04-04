package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.SanPhamDTO;
import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.dto.ChatLieuDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    Page<ChatLieuDTO> getAllChatLieuPaginated(Pageable pageable);

    // lấy tất cả chất liệu

    Optional<ChatLieu> findTopByOrderByMaDesc(); // Tìm mã lớn nhất

    boolean existsByTenChatLieu(String tenChatLieu);

    @Query("SELECT new com.example.shopdragonbee.dto.ChatLieuDTO(cl.id, cl.ma, cl.tenChatLieu, cl.moTa, cl.trangThai) " +
            "FROM ChatLieu cl WHERE cl.trangThai = :trangThai")
    List<ChatLieuDTO> findByTrangThai(String trangThai);

    // tìm kiếm và bộ lọc
    @Query("SELECT new com.example.shopdragonbee.dto.ChatLieuDTO(cl.id, cl.ma, cl.tenChatLieu, cl.moTa, cl.trangThai) " +
            "FROM ChatLieu cl " +
            "WHERE (:tenChatLieu IS NULL OR LOWER(cl.tenChatLieu) LIKE LOWER(CONCAT('%', :tenChatLieu, '%'))) " +
            "AND (:trangThai IS NULL OR :trangThai = '' OR LOWER(cl.trangThai) = LOWER(:trangThai))")
    Page<ChatLieuDTO> searchChatLieu(
            @Param("tenChatLieu") String tenChatLieu,
            @Param("trangThai") String trangThai,
            Pageable pageable
    );


}
