package com.example.shopdragonbee.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "nhan_vien")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhanVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma", nullable = false, unique = true, length = 50)
    private String ma;

    @Column(name = "ten_nhan_vien", nullable = false, length = 100)
    private String tenNhanVien;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Column(name = "gioi_tinh", length = 10)
    private String gioiTinh;

    @Column(name = "sdt", length = 15, unique = true)
    private String sdt;

    @Column(name = "email", length = 100, unique = true)
    private String email;

    @Column(name = "dia_chi", length = 255)
    private String diaChi;

    @Column(name = "anh", length = 255)
    private String anh;

    @Column(name = "cccd", unique = true, length = 20)
    private String cccd;

    @Column(name = "trang_thai", length = 50)
    private String trangThai;

    @Column(name = "ngay_tao", updatable = false, nullable = false)
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;

    @Column(name = "nguoi_tao", length = 50)
    private String nguoiTao;

    @Column(name = "nguoi_sua", length = 50)
    private String nguoiSua;

    @ManyToOne
    @JoinColumn(name = "id_tai_khoan", nullable = false)
    private TaiKhoan taiKhoan;

    @PrePersist
    protected void onCreate() {
        if (this.ngayTao == null) {
            this.ngayTao = LocalDateTime.now();
        }
        if (this.trangThai == null) {
            this.trangThai = "Hoạt động";  // Đặt mặc định là "Hoạt động"
        }
    }


    @PreUpdate
    protected void onUpdate() {
        this.ngaySua = LocalDateTime.now();
    }



}
