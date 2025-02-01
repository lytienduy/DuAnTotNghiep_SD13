package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.KhachHangResponse;
import com.example.shopdragonbee.entity.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangRepository extends CrudRepository<KhachHang, Integer> {

    @Query("SELECT new com.example.shopdragonbee.dto.KhachHangResponse(" +
            "kh.tenKhachHang, kh.sdt, kh.email, kh.ngaySinh) " +
            "FROM KhachHang kh")
    Page<KhachHangResponse> getKhachHangList(Pageable pageable);
}
