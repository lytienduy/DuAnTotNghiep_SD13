package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.KieuDaiQuan;
import com.example.shopdragonbee.respone.DanhMucRespone;
import com.example.shopdragonbee.respone.KieuDaiQuanRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface KieuDaiQuanRepository extends JpaRepository<KieuDaiQuan,Integer> {

    @Query("""
        select new com.example.shopdragonbee.respone.KieuDaiQuanRespone(
            kdq.id,
            kdq.ma,
            kdq.tenKieuDaiQuan,
            kdq.moTa,
            kdq.trangThai
        )
        from KieuDaiQuan kdq
""")
    public List<KieuDaiQuanRespone> getAll();
}
