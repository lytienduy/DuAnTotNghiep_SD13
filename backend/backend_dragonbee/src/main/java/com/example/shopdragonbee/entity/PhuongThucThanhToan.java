package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "phuong_thuc_thanh_toan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhuongThucThanhToan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma", nullable = false, unique = true)
    private String ma;

    @Column(name = "ten_phuong_thuc", nullable = false)
    private String tenPhuongThuc;

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
