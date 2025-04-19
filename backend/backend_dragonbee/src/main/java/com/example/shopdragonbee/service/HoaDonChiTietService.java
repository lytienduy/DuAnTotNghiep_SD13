package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.dto.OrderStatusStatsDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HoaDonChiTietService {

    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private ThanhToanHoaDonRepository thanhToanHoaDonRepository;
    @Autowired
    private PhuongThucThanhToanRepository phuongThucThanhToanRepository;
    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    //Lấy object HoaDonChiTiet đã chuyển đổi thông tin theo id hóa đơn
    public HoaDonChiTietResponseDTO.HoaDonChiTietDTO getHoaDonById(Integer id) {
        return convertHoaDonChiTietToDTO(hoaDonRepository.findById(id).get());
    }


    //Chuyển đổi lấy list url hình ảnh theo listAnhSanPham
    public List<String> listURLAnhSanPhamChiTiet(List<AnhSanPham> list) {
        List<String> listUrl = new ArrayList<>();
        for (AnhSanPham anh : list
        ) {
            listUrl.add(anh.getAnhUrl());
        }
        return listUrl;
    }

    public Boolean xacNhanHoanTien(Integer idHoaDon, Float soTienCanHoan) {
        try {
            ThanhToanHoaDon thanhToanHoaDonHoanTien = new ThanhToanHoaDon();
            thanhToanHoaDonHoanTien.setMa("TTHD" + (System.currentTimeMillis() % 100000));
            thanhToanHoaDonHoanTien.setHoaDon(hoaDonRepository.findById(idHoaDon).get());
            thanhToanHoaDonHoanTien.setPhuongThucThanhToan(phuongThucThanhToanRepository.findById(3).get());//Thanh toán VNPAY
            thanhToanHoaDonHoanTien.setSoTienThanhToan(soTienCanHoan);
            thanhToanHoaDonHoanTien.setNgayTao(LocalDateTime.now());
            thanhToanHoaDonHoanTien.setLoai("Hoàn tiền");
            thanhToanHoaDonRepository.save(thanhToanHoaDonHoanTien);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    //Chuyển đổi sang object có những thông tin bên Hóa Đơn Chi Tiết
    public HoaDonChiTietResponseDTO.HoaDonChiTietDTO convertHoaDonChiTietToDTO(HoaDon hoaDon) {
        List<HoaDonChiTietResponseDTO.ThanhToanHoaDonDTO> listThanhToan = hoaDon.getListThanhToanHoaDon().stream()
                .sorted(Comparator.comparing(
                        ThanhToanHoaDon::getNgayTao,
                        Comparator.nullsLast(Comparator.reverseOrder()) // Đưa null xuống cuối danh sách
                ))
                .map(tt -> new HoaDonChiTietResponseDTO.ThanhToanHoaDonDTO(tt.getId(), tt.getSoTienThanhToan(), tt.getNgayTao(), tt.getPhuongThucThanhToan().getTenPhuongThuc(), tt.getNguoiTao(), tt.getGhiChu(), tt.getLoai()))
                .collect(Collectors.toList());


//        List<HoaDonChiTietResponseDTO.DanhSachSanPhamDTO> listDanhSachSanPham = hoaDon.getListHoaDonChiTiet().stream()
//                .sorted(Comparator.comparing(
//                        HoaDonChiTiet::getNgayTao,
//                        Comparator.nullsLast(Comparator.reverseOrder()) // Đưa null xuống cuối danh sách
//                ))
//                .map(hdct -> new HoaDonChiTietResponseDTO.DanhSachSanPhamDTO(hdct.getId(), listURLAnhSanPhamChiTiet(hdct.getSanPhamChiTiet().getListAnh()), hdct.getSanPhamChiTiet().getSanPham().getTenSanPham() + hdct.getSanPhamChiTiet().getMauSac().getTenMauSac() + " size " + hdct.getSanPhamChiTiet().getSize().getTenSize(), hdct.getSanPhamChiTiet().getId(), hdct.getSanPhamChiTiet().getMa(), hdct.getDonGia(), hdct.getSoLuong(), hdct.getDonGia() * hdct.getSoLuong(), hdct.getTrangThai()))
//                .collect(Collectors.toList());

        List<HoaDonChiTietResponseDTO.DanhSachSanPhamDTO> listDanhSachSanPham = hoaDonChiTietRepository.getHoaDonChiTietByHoaDonAndTrangThaiOrderByNgayTaoDesc(hoaDon, "Hoạt động").stream()
                .sorted(Comparator.comparing(
                        HoaDonChiTiet::getNgayTao,
                        Comparator.nullsLast(Comparator.reverseOrder()) // Đưa null xuống cuối danh sách
                ))
                .map(hdct -> new HoaDonChiTietResponseDTO.DanhSachSanPhamDTO(hdct.getId(), listURLAnhSanPhamChiTiet(hdct.getSanPhamChiTiet().getListAnh()), hdct.getSanPhamChiTiet().getSanPham().getTenSanPham() + hdct.getSanPhamChiTiet().getMauSac().getTenMauSac() + " size " + hdct.getSanPhamChiTiet().getSize().getTenSize(), hdct.getSanPhamChiTiet().getId(), hdct.getSanPhamChiTiet().getMa(), hdct.getDonGia(), hdct.getSoLuong(), hdct.getDonGia() * hdct.getSoLuong(), hdct.getTrangThai()))
                .collect(Collectors.toList());


        List<HoaDonChiTietResponseDTO.LichSuHoaDonDTO> listLichSuHoaDon = hoaDon.getListLichSuHoaDon().stream()
                .sorted(Comparator.comparing(
                        LichSuHoaDon::getNgayTao,
                        Comparator.nullsLast(Comparator.reverseOrder()) // Đưa null xuống cuối danh sách
                ))
                .map(lshd -> new HoaDonChiTietResponseDTO.LichSuHoaDonDTO(lshd.getId(), lshd.getHanhDong(), lshd.getGhiChu(), lshd.getNgayTao(), lshd.getNguoiTao()))
                .collect(Collectors.toList());

        String maPhieuGiamGia = null;
        if (hoaDon.getPhieuGiamGia() != null) {
            maPhieuGiamGia = hoaDon.getPhieuGiamGia().getMa();
        }
        String maKhachHang = null;
        String tenKhachHang = null;
        String sdtKhachHang = null;
        if (hoaDon.getKhachHang() != null) {
            maKhachHang = hoaDon.getKhachHang().getMa();
            tenKhachHang = hoaDon.getKhachHang().getTenKhachHang();
            sdtKhachHang = hoaDon.getKhachHang().getSdt();
        }

        return new HoaDonChiTietResponseDTO.HoaDonChiTietDTO(
                hoaDon.getId(),
                hoaDon.getMa(),
                hoaDon.getLoaiDon(),
                hoaDon.getGhiChu(),
                hoaDon.getTenNguoiNhan(),
                hoaDon.getSdt(),
                hoaDon.getEmailNguoiNhan(),
                hoaDon.getDiaChiNhanHang(),
                maKhachHang,
                tenKhachHang,
                sdtKhachHang,
                hoaDon.getTongTien(),
                hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId(), "Hoạt động"),
                hoaDon.getPhiShip(),
                maPhieuGiamGia,
                hoaDon.getTrangThai(),
                hoaDon.getNgayTao(),
                listThanhToan,
                listDanhSachSanPham,
                listLichSuHoaDon
        );
    }



}
