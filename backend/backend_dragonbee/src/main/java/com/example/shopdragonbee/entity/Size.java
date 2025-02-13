package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "size")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Size {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma", nullable = false, unique = true)
    private String ma;

    @Column(name = "ten_size", nullable = false)
    private String tenSize;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private String trangThai;
}