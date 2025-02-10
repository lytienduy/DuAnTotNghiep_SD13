package com.example.shopdragonbee.respone;

public class DanhMucRespone2 {
    private Integer id;
    private String tenDanhMuc;

    public DanhMucRespone2(Integer id, String tenDanhMuc) {
        this.id = id;
        this.tenDanhMuc = tenDanhMuc;
    }

    public Integer getId() {
        return id;
    }

    public String getTenDanhMuc() {
        return tenDanhMuc;
    }
}
