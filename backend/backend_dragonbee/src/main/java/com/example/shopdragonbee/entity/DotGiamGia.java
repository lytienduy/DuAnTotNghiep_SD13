package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "dot_giam_gia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DotGiamGia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma_dot_giam_gia", nullable = false, unique = true)
    private String maDotGiamGia;

    @Column(name = "loai_dot_giam_gia")
    private String loaiDotGiamGia;

    @Column(name = "ten_dot_giam_gia")
    private String tenDotGiamGia;

    @Column(name = "gia_tri_giam", precision = 10)
    private Double giaTriGiam;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;

    @Column(name = "ngay_tao", columnDefinition = "DATETIME DEFAULT GETDATE()")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;

    @OneToMany(mappedBy = "dotGiamGia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DotGiamGiaChiTiet> chiTietList;
}