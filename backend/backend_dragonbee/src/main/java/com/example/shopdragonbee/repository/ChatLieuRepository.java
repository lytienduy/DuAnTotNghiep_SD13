package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.respone.ChatLieuRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatLieuRepository extends JpaRepository<ChatLieu,Integer> {

    @Query("""
        select new com.example.shopdragonbee.respone.ChatLieuRespone(
            cl.id,
            cl.ma,
            cl.tenChatLieu,
            cl.moTa,
            cl.trangThai
        )
        from ChatLieu cl
""")
    public List<ChatLieuRespone> getAll();
}
