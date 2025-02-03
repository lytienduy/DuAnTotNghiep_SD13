package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.PhieuGiamGiaResponse;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhieuGiamGiaRepository extends CrudRepository<PhieuGiamGia, Integer> {

    // Truy vấn phiếu giảm giá
    @Query("SELECT new com.example.shopdragonbee.dto.PhieuGiamGiaResponse(" +
            "p.ma, p.tenPhieuGiamGia, p.kieuGiamGia, p.loaiPhieuGiamGia, " +
            "p.giaTriGiam, p.soLuong, p.ngayBatDau, p.ngayKetThuc, p.trangThai,p.soTienGiamToiDa,p.soTienToiThieu) " +
            "FROM PhieuGiamGia p")
    Page<PhieuGiamGiaResponse> getPhieuGiamGiaList(Pageable pageable);

    // Truy vấn phiếu giảm giá
    @Query("SELECT new com.example.shopdragonbee.dto.PhieuGiamGiaResponse(" +
            "p.ma, p.tenPhieuGiamGia, p.kieuGiamGia, p.loaiPhieuGiamGia, " +
            "p.giaTriGiam, p.soLuong, p.ngayBatDau, p.ngayKetThuc, p.trangThai) " +
            "FROM PhieuGiamGia p")
    Page<PhieuGiamGiaResponse> getPhieuGiamGiaList1(Pageable pageable);

    // Truy vấn phiếu giảm giá theo mã
    Optional<PhieuGiamGia> findByMa(String ma);

    // Thêm phương thức truy vấn khách hàng theo phiếu giảm giá
    @Query("SELECT p FROM PhieuGiamGia p WHERE p.ma = :ma")
    Optional<PhieuGiamGia> findPhieuGiamGiaByMa(String ma);
}
