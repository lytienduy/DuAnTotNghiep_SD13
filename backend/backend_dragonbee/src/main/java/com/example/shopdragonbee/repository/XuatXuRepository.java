package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.entity.XuatXu;
import com.example.shopdragonbee.dto.XuatXuDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface XuatXuRepository extends JpaRepository<XuatXu, Integer> {

    @Query("""
        select new com.example.shopdragonbee.dto.XuatXuDTO(
          xs.id,
          xs.ma,
          xs.tenXuatXu,
          xs.moTa,
          xs.trangThai          
        )
        from XuatXu xs
    """)
    List<XuatXuDTO> getAll();

    // Lấy mã xuất xứ lớn nhất hiện tại
    @Query("SELECT COALESCE(MAX(xs.ma), 'XX000') FROM XuatXu xs WHERE xs.ma LIKE 'XX%'")
    String findMaxMa();

    // Kiểm tra tên xuất xứ có tồn tại không
    Optional<XuatXu> findByTenXuatXu(String tenXuatXu);
    // theo trạng thái
    @Query("SELECT new com.example.shopdragonbee.dto.XuatXuDTO(xx.id, xx.ma, xx.tenXuatXu, xx.moTa, xx.trangThai) " +
            "FROM XuatXu xx WHERE xx.trangThai = :trangThai")
    List<XuatXuDTO> findByTrangThai(String trangThai);
}
