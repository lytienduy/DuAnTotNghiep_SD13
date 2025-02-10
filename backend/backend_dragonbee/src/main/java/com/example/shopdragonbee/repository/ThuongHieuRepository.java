package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.ThuongHieu;
import com.example.shopdragonbee.respone.ThuongHieuRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ThuongHieuRepository extends JpaRepository<ThuongHieu,Integer> {

    @Query("""
        select new com.example.shopdragonbee.respone.ThuongHieuRespone(
            th.id,
            th.ma,
            th.tenThuongHieu,
            th.moTa,
            th.trangThai
        )
        from ThuongHieu th
""")
    public List<ThuongHieuRespone> getAll();
}
