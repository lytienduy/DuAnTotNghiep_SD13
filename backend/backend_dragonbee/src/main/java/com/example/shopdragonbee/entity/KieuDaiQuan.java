package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "kieu_dai_quan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KieuDaiQuan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma", nullable = false, unique = true)
    private String ma;

    @Column(name = "ten_kieu_dai_quan", nullable = false)
    private String tenKieuDaiQuan;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private String trangThai;
}