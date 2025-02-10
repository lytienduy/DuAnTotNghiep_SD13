package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.KhachHangPGGResponse;
import com.example.shopdragonbee.entity.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangPGGRepository extends CrudRepository<KhachHang, Integer> {

    @Query("SELECT new com.example.shopdragonbee.dto.KhachHangPGGResponse(" +
            "kh.id,kh.tenKhachHang, kh.sdt, kh.email, kh.ngaySinh) " +
            "FROM KhachHang kh")
    Page<KhachHangPGGResponse> getKhachHangList(Pageable pageable);
}
