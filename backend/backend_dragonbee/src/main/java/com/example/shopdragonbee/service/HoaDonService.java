package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.repository.HoaDonRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    public List<HoaDonResponseDTO> getAllHoaDons() {
        List<HoaDon> hoaDons = hoaDonRepository.findAll();
        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<HoaDonResponseDTO> locHoaDon(String timKiem, String tuNgay, String denNgay, String loaiDon, String trangThai) {
        List<HoaDon> hoaDons = hoaDonRepository.findAll((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (timKiem != null && !timKiem.isEmpty()) {
                Predicate searchPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(root.get("ma"), "%" + timKiem + "%"),
                        criteriaBuilder.like(root.get("tenNguoiNhan"), "%" + timKiem + "%"),
                        criteriaBuilder.like(root.get("sdt"), "%" + timKiem + "%")
                        );
                predicates.add(searchPredicate);
            }

            if (tuNgay != null && denNgay != null && !tuNgay.isEmpty() && !denNgay.isEmpty()) {
                Predicate datePredicate = criteriaBuilder.between(
                        root.get("ngayTao"),
                        LocalDate.parse(tuNgay),
                        LocalDate.parse(denNgay).plusDays(1)
                );
                predicates.add(datePredicate);
            }

            if (loaiDon != null && !loaiDon.equalsIgnoreCase("all")) {
                predicates.add(criteriaBuilder.equal(root.get("loaiDon"), loaiDon));
            }

            if (trangThai != null && !trangThai.equalsIgnoreCase("all")) {
                predicates.add(criteriaBuilder.equal(root.get("trangThai"), trangThai));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });

        // Chuyển đổi từ HoaDon sang HoaDonResponseDTO
        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private HoaDonResponseDTO convertToDTO(HoaDon hoaDon) {
        return new HoaDonResponseDTO(
                hoaDon.getId(),
                hoaDon.getMa(),
                hoaDon.getTenNguoiNhan() + " - " + hoaDon.getSdt(),
                hoaDon.getLoaiDon(),
                hoaDon.getNgayTao(),
                hoaDon.getTrangThai(),
                hoaDon.getTongTien()
        );
    }


}
