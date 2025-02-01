package com.example.shopdragonbee.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PhieuGiamGiaResponse {
    private String ma;
    private String tenPhieuGiamGia;
    private String kieuGiamGia;
    private String loaiPhieuGiamGia;
    private double giaTriGiam;  // Thay vì String, để xử lý số chính xác
    private int soLuong;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private String trangThai;

    // Phương thức bổ sung để trả về chuỗi hiển thị giá trị giảm
    @JsonProperty("formattedGiaTriGiam")
    public String getFormattedGiaTriGiam() {
        if ("Phần trăm".equalsIgnoreCase(loaiPhieuGiamGia)) {
            return giaTriGiam + "%";
        } else if ("Cố định".equalsIgnoreCase(loaiPhieuGiamGia)) {
            return giaTriGiam + " VNĐ";
        } else {
            return String.valueOf(giaTriGiam);
        }
    }
}
