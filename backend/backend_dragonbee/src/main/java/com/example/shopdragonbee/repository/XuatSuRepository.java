package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.XuatXu;
import com.example.shopdragonbee.respone.XuatSuRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface XuatSuRepository extends JpaRepository<XuatXu,Integer> {

    @Query("""
        select new com.example.shopdragonbee.respone.XuatSuRespone(
          xs.id,
          xs.ma,
          xs.tenXuatXu,
          xs.moTa,
          xs.trangThai          
        )
        from XuatXu xs
""")
    public List<XuatSuRespone> getAll();
}
