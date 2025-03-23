package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vai_tro")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VaiTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma", nullable = false, unique = true)
    private String ma;

    @Column(name = "ten_vai_tro", nullable = false, unique = true)
    private String tenVaiTro;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_tao", columnDefinition = "DATETIME DEFAULT GETDATE()")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;
}
