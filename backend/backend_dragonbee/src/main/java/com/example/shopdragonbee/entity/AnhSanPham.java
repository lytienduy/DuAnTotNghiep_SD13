package com.example.shopdragonbee.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;



@Entity
@Table(name = "anh_san_pham")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnhSanPham {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma", nullable = false)
    private String ma;

    @Column(name = "anh_url", nullable = false)
    private String anhUrl;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private String trangThai = "Hoạt động";

    @ManyToOne
    @JoinColumn(name = "id_san_pham_chi_tiet", nullable = false)
    @JsonBackReference // Phía "con", ngừng vòng lặp
    private SanPhamChiTiet sanPhamChiTiet;
}


