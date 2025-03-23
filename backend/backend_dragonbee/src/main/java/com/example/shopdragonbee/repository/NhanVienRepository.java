package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.NhanVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Integer> {

    @Query("SELECT n FROM NhanVien n WHERE " +
            "(:keyword IS NULL OR LOWER(n.ma) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
            "(:keyword IS NULL OR LOWER(n.tenNhanVien) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
            "(:keyword IS NULL OR LOWER(n.diaChi) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
            "(:keyword IS NULL OR LOWER(n.gioiTinh) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
            "(:keyword IS NULL OR LOWER(n.trangThai) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
            "(:keyword IS NULL OR LOWER(n.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
            "(:keyword IS NULL OR LOWER(n.sdt) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<NhanVien> searchNhanVien(@Param("keyword") String keyword);

    @Query("""
    SELECT n FROM NhanVien n 
    WHERE (:trangThai IS NULL OR n.trangThai = :trangThai)
      AND (:gioiTinh IS NULL OR n.gioiTinh = :gioiTinh)
    """)
    List<NhanVien> findByTrangThaiAndGioiTinh(
            @Param("trangThai") String trangThai,
            @Param("gioiTinh") String gioiTinh
    );





    @Query("SELECT n FROM NhanVien n WHERE YEAR(CURRENT_DATE) - YEAR(n.ngaySinh) BETWEEN :minAge AND :maxAge")
    List<NhanVien> findByAgeRange(@Param("minAge") int minAge, @Param("maxAge") int maxAge);



    Page<NhanVien> findAll(Pageable pageable);
    Optional<NhanVien> findByMa(String ma);
    Optional<NhanVien> findByCccd(String cccd);
    boolean existsBySdt(String sdt);
    List<NhanVien> findAllByOrderByNgayTaoDesc();
    @Query("SELECT n.ma FROM NhanVien n ORDER BY n.id DESC LIMIT 1")
    String findLastMaNhanVien();
    boolean existsByCccd(String cccd);







}

