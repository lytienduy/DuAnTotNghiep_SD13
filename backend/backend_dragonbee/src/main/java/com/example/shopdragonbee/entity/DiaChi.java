package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;


import java.time.LocalDateTime;

@Entity
@Table(name = "dia_chi")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiaChi {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang", nullable = false)
    private KhachHang khachHang;

    @Column(name = "so_nha")
    private String soNha;

    @Column(name = "duong")
    private String duong;

    @Column(name = "xa")
    private String xa;

    @Column(name = "huyen")
    private String huyen;

    @Column(name = "thanh_pho")
    private String thanhPho;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "mac_dinh", columnDefinition = "BIT DEFAULT 0")
    private Boolean macDinh;

    @Column(name = "ngay_tao", columnDefinition = "DATETIME DEFAULT GETDATE()")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;


}
