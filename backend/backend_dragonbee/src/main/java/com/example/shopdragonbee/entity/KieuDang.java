package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "kieu_dang")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KieuDang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma", nullable = false, unique = true)
    private String ma;

    @Column(name = "ten_kieu_dang", nullable = false)
    private String tenKieuDang;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private String trangThai;
}