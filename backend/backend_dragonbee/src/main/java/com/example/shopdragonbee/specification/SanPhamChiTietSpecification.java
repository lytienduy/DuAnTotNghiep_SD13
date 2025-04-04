package com.example.shopdragonbee.specification;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import org.springframework.data.jpa.domain.Specification;

public class SanPhamChiTietSpecification {

    public static Specification<SanPhamChiTiet> hasTenSanPhamLike(String tenSanPham) {
        return (root, query, criteriaBuilder) ->
                tenSanPham == null ? null :
                        criteriaBuilder.like(root.get("sanPham").get("tenSanPham"), "%" + tenSanPham + "%");
    }

    public static Specification<SanPhamChiTiet> hasDanhMuc(String tenDanhMuc) {
        return (root, query, criteriaBuilder) ->
                tenDanhMuc == null ? null :
                        criteriaBuilder.like(root.get("danhMuc").get("ten"), "%" + tenDanhMuc + "%");
    }

    public static Specification<SanPhamChiTiet> hasThuongHieu(String tenThuongHieu) {
        return (root, query, criteriaBuilder) ->
                tenThuongHieu == null ? null :
                        criteriaBuilder.like(root.get("thuongHieu").get("ten"), "%" + tenThuongHieu + "%");
    }

    public static Specification<SanPhamChiTiet> hasPhongCach(String tenPhongCach) {
        return (root, query, criteriaBuilder) ->
                tenPhongCach == null ? null :
                        criteriaBuilder.like(root.get("phongCach").get("ten"), "%" + tenPhongCach + "%");
    }

    public static Specification<SanPhamChiTiet> hasChatLieu(String tenChatLieu) {
        return (root, query, criteriaBuilder) ->
                tenChatLieu == null ? null :
                        criteriaBuilder.like(root.get("chatLieu").get("ten"), "%" + tenChatLieu + "%");
    }

    public static Specification<SanPhamChiTiet> hasKieuDang(String tenKieuDang) {
        return (root, query, criteriaBuilder) ->
                tenKieuDang == null ? null :
                        criteriaBuilder.like(root.get("kieuDang").get("ten"), "%" + tenKieuDang + "%");
    }

    public static Specification<SanPhamChiTiet> hasKieuDaiQuan(String tenKieuDaiQuan) {
        return (root, query, criteriaBuilder) ->
                tenKieuDaiQuan == null ? null :
                        criteriaBuilder.like(root.get("kieuDaiQuan").get("ten"), "%" + tenKieuDaiQuan + "%");
    }

    public static Specification<SanPhamChiTiet> hasMauSac(String tenMauSac) {
        return (root, query, criteriaBuilder) ->
                tenMauSac == null ? null :
                        criteriaBuilder.like(root.get("mauSac").get("ten"), "%" + tenMauSac + "%");
    }

    public static Specification<SanPhamChiTiet> hasSize(String tenSize) {
        return (root, query, criteriaBuilder) ->
                tenSize == null ? null :
                        criteriaBuilder.like(root.get("size").get("ten"), "%" + tenSize + "%");
    }

    public static Specification<SanPhamChiTiet> isPriceBetween(Double minPrice, Double maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice != null && maxPrice != null)
                return criteriaBuilder.between(root.get("gia"), minPrice, maxPrice);
            if (minPrice != null)
                return criteriaBuilder.greaterThanOrEqualTo(root.get("gia"), minPrice);
            return criteriaBuilder.lessThanOrEqualTo(root.get("gia"), maxPrice);
        };
    }
}