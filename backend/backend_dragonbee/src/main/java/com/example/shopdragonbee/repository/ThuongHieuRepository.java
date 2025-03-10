package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.entity.ThuongHieu;
import com.example.shopdragonbee.respone.ThuongHieuRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ThuongHieuRepository extends JpaRepository<ThuongHieu, Integer> {

    @Query("""
        select new com.example.shopdragonbee.dto.ThuongHieuDTO(
            th.id,
            th.ma,
            th.tenThuongHieu,
            th.moTa,
            th.trangThai
        )
        from ThuongHieu th
    """)
    List<ThuongHieuDTO> getAll();

    // Kiểm tra xem tên thương hiệu có tồn tại trong DB không
    boolean existsByTenThuongHieu(String tenThuongHieu);

    // Lấy mã lớn nhất hiện tại trong DB
    @Query("SELECT MAX(CAST(SUBSTRING(th.ma, 3) AS int)) FROM ThuongHieu th")
    Integer findMaxMa();

    /// theo trạng thái
    @Query("SELECT new com.example.shopdragonbee.dto.ThuongHieuDTO(t.id, t.ma, t.tenThuongHieu, t.moTa, t.trangThai) " +
            "FROM ThuongHieu t WHERE t.trangThai = :trangThai")
    List<ThuongHieuDTO> findByTrangThai(String trangThai);
}
