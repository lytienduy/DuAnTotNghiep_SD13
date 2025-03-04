package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;


import java.time.LocalDateTime;

@Entity
@Table(name = "dot_giam_gia_chi_tiet")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DotGiamGiaChiTiet {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_dot_giam_gia", nullable = false)
    private DotGiamGia dotGiamGia;

    @ManyToOne
    @JoinColumn(name = "id_chi_tiet_san_pham", nullable = false)
    private SanPhamChiTiet sanPhamChiTiet;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_tao", columnDefinition = "DATETIME DEFAULT GETDATE()")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;


}
