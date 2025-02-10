package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.respone.DanhMucRespone;
import com.example.shopdragonbee.respone.DanhMucRespone2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DanhMucRepository extends JpaRepository<DanhMuc,Integer> {
    @Query("""
        select new com.example.shopdragonbee.respone.DanhMucRespone(
            dm.id,
            dm.ma,
            dm.tenDanhMuc,
            dm.moTa,
            dm.trangThai
        )
        from DanhMuc dm
""")
    public List<DanhMucRespone> getAll();


    @Query("SELECT new com.example.shopdragonbee.respone.DanhMucRespone2(d.id, d.tenDanhMuc) FROM DanhMuc d")
    List<DanhMucRespone2> getAllDanhMuc();
}
