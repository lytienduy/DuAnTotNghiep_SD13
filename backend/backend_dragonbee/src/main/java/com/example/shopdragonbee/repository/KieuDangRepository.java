package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.KieuDang;
import com.example.shopdragonbee.respone.KieuDangRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface KieuDangRepository extends JpaRepository<KieuDang,Integer> {

    @Query("""
    select new com.example.shopdragonbee.respone.KieuDangRespone(
        kd.id,
        kd.ma,
        kd.tenKieuDang,
        kd.moTa,
        kd.trangThai
    )
    from KieuDang kd
""")
    public List<KieuDangRespone> getAll();
}
