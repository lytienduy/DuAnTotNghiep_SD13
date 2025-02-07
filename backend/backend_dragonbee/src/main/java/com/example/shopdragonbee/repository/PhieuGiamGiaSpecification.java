package com.example.shopdragonbee.repository;

import com.example.shopdragonbee.entity.PhieuGiamGia;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

public class PhieuGiamGiaSpecification {
    public static Specification<PhieuGiamGia> search(String maOrTen, LocalDateTime tuNgay, LocalDateTime denNgay, String kieuGiamGia, String trangThai) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction(); // Tạo điều kiện mặc định "True"

            // Kiểm tra nếu maOrTen không rỗng, tìm kiếm theo mã hoặc tên
            if (maOrTen != null && !maOrTen.trim().isEmpty()) {
                Predicate maPredicate = criteriaBuilder.like(root.get("ma"), "%" + maOrTen + "%");
                Predicate tenPredicate = criteriaBuilder.like(root.get("tenPhieuGiamGia"), "%" + maOrTen + "%");
                predicate = criteriaBuilder.or(maPredicate, tenPredicate);  // Tìm theo mã hoặc tên
            }

            // Lọc theo ngày bắt đầu và ngày kết thúc
            if (tuNgay != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.greaterThanOrEqualTo(root.get("ngayBatDau"), tuNgay));
            }
            if (denNgay != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.lessThanOrEqualTo(root.get("ngayKetThuc"), denNgay));
            }

            if (StringUtils.hasText(kieuGiamGia)) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("kieuGiamGia"), kieuGiamGia));
            }

            if (StringUtils.hasText(trangThai)) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("trangThai"), trangThai));
            }

            return predicate;
        };
    }
}
