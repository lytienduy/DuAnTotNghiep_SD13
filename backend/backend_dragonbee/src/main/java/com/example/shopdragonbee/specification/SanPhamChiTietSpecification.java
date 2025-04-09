package com.example.shopdragonbee.specification;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.jpa.domain.Specification;

public class SanPhamChiTietSpecification {

    public static Specification<SanPhamChiTiet> hasTenSanPhamLike(String tenSanPham) {
        return (root, query, cb) ->
                tenSanPham == null ? null :
                        cb.like(root.get("sanPham").get("tenSanPham"), "%" + tenSanPham + "%");
    }

    public static Specification<SanPhamChiTiet> hasDanhMuc(String tenDanhMuc) {
        return (root, query, cb) ->
                tenDanhMuc == null ? null :
                        cb.like(root.get("danhMuc").get("tenDanhMuc"), "%" + tenDanhMuc + "%");
    }

    public static Specification<SanPhamChiTiet> hasThuongHieu(String tenThuongHieu) {
        return (root, query, cb) ->
                tenThuongHieu == null ? null :
                        cb.like(root.get("thuongHieu").get("tenThuongHieu"), "%" + tenThuongHieu + "%");
    }

    public static Specification<SanPhamChiTiet> hasPhongCach(String tenPhongCach) {
        return (root, query, cb) ->
                tenPhongCach == null ? null :
                        cb.like(root.get("phongCach").get("tenPhongCach"), "%" + tenPhongCach + "%");
    }

    public static Specification<SanPhamChiTiet> hasChatLieu(String tenChatLieu) {
        return (root, query, cb) ->
                tenChatLieu == null ? null :
                        cb.like(root.get("chatLieu").get("tenChatLieu"), "%" + tenChatLieu + "%");
    }

    public static Specification<SanPhamChiTiet> hasKieuDang(String tenKieuDang) {
        return (root, query, cb) ->
                tenKieuDang == null ? null :
                        cb.like(root.get("kieuDang").get("tenKieuDang"), "%" + tenKieuDang + "%");
    }

    public static Specification<SanPhamChiTiet> hasKieuDaiQuan(String tenKieuDaiQuan) {
        return (root, query, cb) ->
                tenKieuDaiQuan == null ? null :
                        cb.like(root.get("kieuDaiQuan").get("tenKieuDaiQuan"), "%" + tenKieuDaiQuan + "%");
    }

    public static Specification<SanPhamChiTiet> hasMauSac(String tenMauSac) {
        return (root, query, cb) ->
                tenMauSac == null ? null :
                        cb.like(root.get("mauSac").get("tenMauSac"), "%" + tenMauSac + "%");
    }

    public static Specification<SanPhamChiTiet> hasSize(String tenSize) {
        return (root, query, cb) ->
                tenSize == null ? null :
                        cb.like(root.get("size").get("tenSize"), "%" + tenSize + "%");
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