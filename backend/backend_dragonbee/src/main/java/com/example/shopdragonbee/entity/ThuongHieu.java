package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "thuong_hieu")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThuongHieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma", nullable = false, unique = true)
    private String ma;

    @Column(name = "ten_thuong_hieu", nullable = false)
    private String tenThuongHieu;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private String trangThai;
}