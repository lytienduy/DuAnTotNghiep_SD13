package com.example.shopdragonbee.specification;

import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.jpa.domain.Specification;

public class SanPhamChiTietSpecification {

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    public static Specification<SanPhamChiTiet> hasTenSanPhamLike(String tenSanPham) {
        return (root, query, cb) ->
                isBlank(tenSanPham) ? null :
                        cb.like(cb.lower(root.get("sanPham").get("tenSanPham")), "%" + tenSanPham.toLowerCase() + "%");
    }

    public static Specification<SanPhamChiTiet> hasDanhMuc(String tenDanhMuc) {
        return (root, query, cb) ->
                isBlank(tenDanhMuc) ? null :
                        cb.like(cb.lower(root.get("danhMuc").get("tenDanhMuc")), "%" + tenDanhMuc.toLowerCase() + "%");
    }

    public static Specification<SanPhamChiTiet> hasThuongHieu(String tenThuongHieu) {
        return (root, query, cb) ->
                isBlank(tenThuongHieu) ? null :
                        cb.like(cb.lower(root.get("thuongHieu").get("tenThuongHieu")), "%" + tenThuongHieu.toLowerCase() + "%");
    }

    public static Specification<SanPhamChiTiet> hasPhongCach(String tenPhongCach) {
        return (root, query, cb) ->
                isBlank(tenPhongCach) ? null :
                        cb.like(cb.lower(root.get("phongCach").get("tenPhongCach")), "%" + tenPhongCach.toLowerCase() + "%");
    }

    public static Specification<SanPhamChiTiet> hasChatLieu(String tenChatLieu) {
        return (root, query, cb) ->
                isBlank(tenChatLieu) ? null :
                        cb.like(cb.lower(root.get("chatLieu").get("tenChatLieu")), "%" + tenChatLieu.toLowerCase() + "%");
    }

    public static Specification<SanPhamChiTiet> hasKieuDang(String tenKieuDang) {
        return (root, query, cb) ->
                isBlank(tenKieuDang) ? null :
                        cb.like(cb.lower(root.get("kieuDang").get("tenKieuDang")), "%" + tenKieuDang.toLowerCase() + "%");
    }

    public static Specification<SanPhamChiTiet> hasKieuDaiQuan(String tenKieuDaiQuan) {
        return (root, query, cb) ->
                isBlank(tenKieuDaiQuan) ? null :
                        cb.like(cb.lower(root.get("kieuDaiQuan").get("tenKieuDaiQuan")), "%" + tenKieuDaiQuan.toLowerCase() + "%");
    }

    public static Specification<SanPhamChiTiet> hasMauSac(String tenMauSac) {
        return (root, query, cb) ->
                isBlank(tenMauSac) ? null :
                        cb.like(cb.lower(root.get("mauSac").get("tenMauSac")), "%" + tenMauSac.toLowerCase() + "%");
    }

    public static Specification<SanPhamChiTiet> hasSize(String tenSize) {
        return (root, query, cb) ->
                isBlank(tenSize) ? null :
                        cb.like(cb.lower(root.get("size").get("tenSize")), "%" + tenSize.toLowerCase() + "%");
    }

    public static Specification<SanPhamChiTiet> isPriceBetween(Double minPrice, Double maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice != null && maxPrice != null)
                return cb.between(root.get("gia"), minPrice, maxPrice);
            if (minPrice != null)
                return cb.greaterThanOrEqualTo(root.get("gia"), minPrice);
            return cb.lessThanOrEqualTo(root.get("gia"), maxPrice);
        };
    }
}
