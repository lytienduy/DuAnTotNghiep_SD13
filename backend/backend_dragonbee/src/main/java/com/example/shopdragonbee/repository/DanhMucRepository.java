package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.respone.DanhMucRespone;
import com.example.shopdragonbee.respone.DanhMucRespone2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DanhMucRepository extends JpaRepository<DanhMuc, Integer> {

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
    List<DanhMucRespone> getAll();

    @Query("SELECT new com.example.shopdragonbee.respone.DanhMucRespone2(d.id, d.tenDanhMuc) FROM DanhMuc d")
    List<DanhMucRespone2> getAllDanhMuc();

    @Query("SELECT MAX(d.ma) FROM DanhMuc d WHERE d.ma LIKE 'DM%'")
    String findMaxMaDanhMuc();

    Optional<DanhMuc> findByTenDanhMuc(String tenDanhMuc);
    // theo trạng thái
    @Query("SELECT new com.example.shopdragonbee.dto.DanhMucDTO(dm.id, dm.ma, dm.tenDanhMuc, dm.moTa, dm.trangThai) " +
            "FROM DanhMuc dm WHERE dm.trangThai = :trangThai")
    List<DanhMucDTO> findByTrangThai(String trangThai);
}
