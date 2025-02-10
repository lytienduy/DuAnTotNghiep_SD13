package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.KhachHangPGGResponse;
import com.example.shopdragonbee.entity.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangPGGRepository extends JpaRepository<KhachHang, Integer> {

    @Query("SELECT new com.example.shopdragonbee.dto.KhachHangPGGResponse(" +
            "kh.id,kh.tenKhachHang, kh.sdt, kh.email, kh.ngaySinh) " +
            "FROM KhachHang kh")
    Page<KhachHangPGGResponse> getKhachHangList(Pageable pageable);

    @Query("SELECT new com.example.shopdragonbee.dto.KhachHangPGGResponse(" +
            "kh.id, kh.tenKhachHang, kh.sdt, kh.email, kh.ngaySinh) " +
            "FROM KhachHang kh " +
            "WHERE (:keyword IS NULL OR :keyword = '' " +
            "OR LOWER(kh.tenKhachHang) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR kh.sdt LIKE CONCAT('%', :keyword, '%'))")
    Page<KhachHangPGGResponse> searchKhachHang(@org.springframework.data.repository.query.Param("keyword") String keyword, Pageable pageable);

}
