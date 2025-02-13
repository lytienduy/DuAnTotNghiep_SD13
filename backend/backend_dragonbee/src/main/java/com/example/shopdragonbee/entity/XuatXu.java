package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "xuat_xu")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class XuatXu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma", nullable = false, unique = true)
    private String ma;

    @Column(name = "ten_xuat_xu", nullable = false)
    private String tenXuatXu;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private String trangThai;
}