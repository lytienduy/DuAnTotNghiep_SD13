package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.Size;
import com.example.shopdragonbee.respone.SizeRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SizeRepository extends JpaRepository<Size,Integer> {

    @Query("""
        select new com.example.shopdragonbee.respone.SizeRespone(
            s.id,
            s.ma,
            s.tenSize,
            s.moTa,
            s.trangThai
        )
        from Size s
""")
    public List<SizeRespone> getAll();
}
