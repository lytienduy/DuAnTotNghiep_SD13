package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.PhongCach;
import com.example.shopdragonbee.respone.PhongCachRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PhongCachRepository extends JpaRepository<PhongCach,Integer> {

    @Query("""
        select new com.example.shopdragonbee.respone.PhongCachRespone(
            pc.id,
            pc.ma,
            pc.tenPhongCach,
            pc.moTa,
            pc.trangThai
        )
        from PhongCach  pc
""")
    public List<PhongCachRespone> getAll();
}
