package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.KieuDaiQuanDTO;
import com.example.shopdragonbee.entity.KieuDaiQuan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KieuDaiQuanRepository extends JpaRepository<KieuDaiQuan, Integer> {

    // Query lấy tất cả kiểu đai quần dưới dạng DTO
    @Query("""
        select new com.example.shopdragonbee.dto.KieuDaiQuanDTO(
            kdq.id,
            kdq.ma,
            kdq.tenKieuDaiQuan,
            kdq.moTa,
            kdq.trangThai
        )
        from KieuDaiQuan kdq
    """)
    public List<KieuDaiQuanDTO> getAll();

    // Query lấy mã kiểu đai quần lớn nhất
    @Query("select max(kdq.ma) from KieuDaiQuan kdq")
    Optional<String> findMaxId();

    // Kiểm tra tên kiểu đai quần đã tồn tại trong DB
    boolean existsByTenKieuDaiQuan(String tenKieuDaiQuan);
}
