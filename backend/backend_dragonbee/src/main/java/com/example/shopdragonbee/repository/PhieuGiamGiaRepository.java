package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.PhieuGiamGiaResponse;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhieuGiamGiaRepository extends CrudRepository<PhieuGiamGia, Integer> {

    @Query("SELECT new com.example.shopdragonbee.dto.PhieuGiamGiaResponse(" +
            "p.ma, p.tenPhieuGiamGia, p.kieuGiamGia, p.loaiPhieuGiamGia, " +
            "p.giaTriGiam, p.soLuong, p.ngayBatDau, p.ngayKetThuc, p.trangThai) " +
            "FROM PhieuGiamGia p")
    Page<PhieuGiamGiaResponse> getPhieuGiamGiaList(Pageable pageable);
}
