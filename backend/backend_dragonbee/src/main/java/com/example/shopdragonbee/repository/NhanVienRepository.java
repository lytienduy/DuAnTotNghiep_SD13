package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.NhanVien;
import com.example.shopdragonbee.respone.NhanVienRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NhanVienRepository extends JpaRepository<NhanVien,Integer> {

    @Query("""
        select new com.example.shopdragonbee.respone.NhanVienRespone(
            nv.id,
            nv.ma,
            nv.tenNhanVien,
            nv.ngaySinh,
            nv.gioiTinh,
            nv.sdt,
            nv.email,
            nv.diaChi,
            nv.trangThai
        )
        from NhanVien nv
""")
    public List<NhanVienRespone> getAll();
}
