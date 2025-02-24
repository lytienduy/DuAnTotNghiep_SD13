package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.KieuDangDTO;
import com.example.shopdragonbee.entity.KieuDang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface KieuDangRepository extends JpaRepository<KieuDang, Integer> {

    @Query("""
    select new com.example.shopdragonbee.dto.KieuDangDTO(
        kd.id,
        kd.ma,
        kd.tenKieuDang,
        kd.moTa,
        kd.trangThai
    )
    from KieuDang kd
    """)
    public List<KieuDangDTO> getAll();

    // Tìm kiểu dáng theo tên
    Optional<KieuDang> findByTenKieuDang(String tenKieuDang);
    @Query("SELECT new com.example.shopdragonbee.dto.KieuDangDTO(kd.id, kd.ma, kd.tenKieuDang, kd.moTa, kd.trangThai) " +
            "FROM KieuDang kd WHERE kd.trangThai = :trangThai")
    List<KieuDangDTO> findByTrangThai(String trangThai);
}
