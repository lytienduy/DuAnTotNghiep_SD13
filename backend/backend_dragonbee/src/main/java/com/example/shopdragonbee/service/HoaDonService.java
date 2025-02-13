package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
//
//    public List<HoaDonResponseDTO> getCanceledHoaDons() {
//        List<HoaDon> hoaDons = hoaDonRepository.findByTrangThai("Đã hủy");
//        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
//
//    }
//
//    public List<HoaDonResponseDTO> getPendingConfirmationHoaDons() {
//        List<HoaDon> hoaDons = hoaDonRepository.findByTrangThai("Chờ xác nhận");
//        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
//    }
//
//    public List<HoaDonResponseDTO> getPendingDeliveryHoaDons() {
//        List<HoaDon> hoaDons = hoaDonRepository.findByTrangThai("Chờ giao hàng");
//        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
//    }
//
//    public List<HoaDonResponseDTO> getShippingHoaDons() {
//        List<HoaDon> hoaDons = hoaDonRepository.findByTrangThai("Đang vận chuyển");
//        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
//    }
//
//    public List<HoaDonResponseDTO> getDeliveredHoaDons() {
//        List<HoaDon> hoaDons = hoaDonRepository.findByTrangThai("Đã giao hàng");
//        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
//    }
//
//    public List<HoaDonResponseDTO> getPaidHoaDons() {
//        List<HoaDon> hoaDons = hoaDonRepository.findByTrangThai("Đã thanh toán");
//        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
//    }
//
//    public List<HoaDonResponseDTO> getPendingPaymentHoaDons() {
//        List<HoaDon> hoaDons = hoaDonRepository.findByTrangThai("Chờ thanh toán");
//        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
//    }
//    public List<HoaDonResponseDTO> getCompleteHoaDons() {
//        List<HoaDon> hoaDons = hoaDonRepository.findByTrangThai("Hoàn thành");
//        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
//    }
//
//    // Hàm lọc chung theo trạng thái
//    private List<HoaDonResponseDTO> filterByStatus(String status) {
//        List<HoaDon> filteredHoaDons = hoaDonRepository.findByTrangThai(status);
//        return filteredHoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
//    }


    public List<HoaDonResponseDTO> timKiemTheoLoaiDon(String loaiDon) {
        List<HoaDon> filteredHoaDons = hoaDonRepository.findByLoaiDon(loaiDon);
        return filteredHoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    public List<HoaDonResponseDTO> timKiemTheoTrangThai(String trangThai) {
        List<HoaDon> filteredHoaDons = hoaDonRepository.findByTrangThai(trangThai);
        return filteredHoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<HoaDonResponseDTO> timKiemTheoTrangThaiAndLoaiDon(String trangThai, String loaiDon) {
        List<HoaDon> filteredHoaDons = hoaDonRepository.findByTrangThaiAndLoaiDon(trangThai, loaiDon);
        return filteredHoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
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
