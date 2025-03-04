package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.SizeDTO;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.entity.Size;
import com.example.shopdragonbee.respone.SizeRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size,Integer> {

    @Query("""
        select new com.example.shopdragonbee.respone.SizeRespone(
            s.id,
            s.ma,
            s.tenSize,
            s.moTa,
            s.trangThai
        )
        from Size s
""")
    public List<SizeRespone> getAll();
    Optional<Size> findByTenSize(String tenSize);

    /// theo trạng thái
    @Query("SELECT new com.example.shopdragonbee.dto.SizeDTO(ss.id, ss.ma, ss.tenSize, ss.moTa, ss.trangThai) " +
            "FROM Size ss WHERE ss.trangThai = :trangThai")
    List<SizeDTO> findByTrangThai(String trangThai);
}
