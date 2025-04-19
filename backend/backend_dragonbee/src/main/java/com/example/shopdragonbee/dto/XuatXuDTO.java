package com.example.shopdragonbee.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class XuatXuDTO {

    private Integer id;
    private String ma;
    private String tenXuatXu;
    private String moTa;
    private String trangThai;

    public XuatXuDTO(Integer id, String tenXuatXu) {
        this.id = id;
        this.tenXuatXu = tenXuatXu;
    }
}
