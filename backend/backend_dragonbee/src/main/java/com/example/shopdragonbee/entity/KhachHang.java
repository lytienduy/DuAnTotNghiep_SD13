package com.example.shopdragonbee.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "khach_hang")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma", nullable = false, unique = true)
    private String ma;

    @Column(name = "ten_khach_hang", nullable = false)
    private String tenKhachHang;

    @Column(name = "ngay_sinh", nullable = true)
    private LocalDate ngaySinh;

    @Column(name = "gioi_tinh", nullable = true)
    private String gioiTinh;

    @Column(name = "sdt", nullable = true)
    private String sdt;

    @Column(name = "email", unique = true)
    private String email;

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

    @OneToOne
    @JoinColumn(name = "id_tai_khoan", nullable = false)
    @JsonIgnore
    private TaiKhoan taiKhoan;

    @OneToMany(mappedBy = "khachHang", cascade = CascadeType.ALL, orphanRemoval = true)

    @JsonIgnore // Tránh tuần hoàn khi chuyển đổi thành JSON

    private List<DiaChi> diaChis;
}
