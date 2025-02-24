package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.dto.MauSacDTO;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.entity.MauSac;
import com.example.shopdragonbee.respone.MauSacRespone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MauSacRepository extends JpaRepository<MauSac,Integer> {

    @Query("""
        select new com.example.shopdragonbee.respone.MauSacRespone(
            ms.id,
            ms.ma,
            ms.tenMauSac,
            ms.moTa,
            ms.trangThai
        )
        from MauSac ms
""")
    public List<MauSacRespone> getAll();
    Optional<MauSac> findByTenMauSac(String tenMauSac);

    /// theo trạng thái
    @Query("SELECT new com.example.shopdragonbee.dto.MauSacDTO(ms.id, ms.ma, ms.tenMauSac, ms.moTa, ms.trangThai) " +
            "FROM MauSac ms WHERE ms.trangThai = :trangThai")
    List<MauSacDTO> findByTrangThai(String trangThai);
}
