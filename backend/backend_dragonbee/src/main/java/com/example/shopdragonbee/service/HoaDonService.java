package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.HoaDonRepository;
import com.example.shopdragonbee.repository.LichSuHoaDonRepository;
import com.example.shopdragonbee.repository.SanPhamChiTietRepositoryP;
import com.example.shopdragonbee.repository.ThanhToanHoaDonRepository;
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
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private LichSuHoaDonRepository lichSuHoaDonRepository;

    @Autowired
    private ThanhToanHoaDonRepository thanhToanHoaDonRepository;

    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;

    //Hầm lấy tất cả trả về List<HoaDonResponseDTO>
    public List<HoaDonResponseDTO> getAllHoaDons() {
        List<HoaDon> hoaDons = hoaDonRepository.findAll();
        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    //Hàm lấy listCount số lượng hóa đơn của từng trạng thái theo listHoaDon theo bộ lọc
    public List<Integer> laySoLuongHoaDonTrangThaiVaHoaDon(String timKiem, String tuNgay, String denNgay, String loaiDon, String trangThai) {
        // Các trạng thái cần đếm
        String[] trangThais;
        if ("all".equalsIgnoreCase(loaiDon) || "Online".equalsIgnoreCase(loaiDon)) {
            trangThais = new String[]{
                    "Chờ xác nhận", "Đã xác nhận", "Chờ giao hàng", "Đang vận chuyển",
                    "Đã giao hàng", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành", "Đã hủy"
            };
        } else {
            trangThais = new String[]{
                    "Chờ thanh toán", "Đã thanh toán", "Hoàn thành", "Đã hủy"
            };
        }

        List<HoaDonResponseDTO> listHoaDonHienTaiDangFill = locHoaDon(timKiem, tuNgay, denNgay, loaiDon, null);
        List<Integer> counts = new ArrayList<>();
        counts.add(listHoaDonHienTaiDangFill.size());
        Arrays.stream(trangThais)
                .map(status -> (int) listHoaDonHienTaiDangFill.stream().filter(hd -> hd.getTrangThai().equalsIgnoreCase(status)).count())
                .forEach(counts::add);
        return counts;
    }

    //Hàm lọc hóa đơn trả về List HoaDonDTO bên hóa đơn
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

            if (trangThai != null && !trangThai.equalsIgnoreCase("Tất Cả")) {
                predicates.add(criteriaBuilder.equal(root.get("trangThai"), trangThai));
            }
            query.orderBy(criteriaBuilder.asc(root.get("ngayTao")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });

        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

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

    //Cập nhật trạng thái hóa đơn bên Hóa Đơn Chi Tiết
    public Boolean capNhatTrangThaiHoaDon(Integer idHoaDon, String trangThai, String hanhDong, String lyDo) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).get();
        if (trangThai.equalsIgnoreCase("Đã hủy")) {
            for (HoaDonChiTiet hoaDonChiTiet : hoaDon.getListHoaDonChiTiet()
            ) {
                SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepositoryP.findById(hoaDonChiTiet.getSanPhamChiTiet().getId()).get();
                sanPhamChiTiet.setSoLuong((sanPhamChiTiet.getSoLuong() + hoaDonChiTiet.getSoLuong()));
                sanPhamChiTietRepositoryP.save(sanPhamChiTiet);
            }
        }

        hoaDon.setTrangThai(trangThai);
        try {
            HoaDon savedHoaDon = hoaDonRepository.save(hoaDon);
            if (savedHoaDon.getId() != null) {
                LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
                lichSuHoaDon.setHoaDon(hoaDon);
                lichSuHoaDon.setHanhDong(hanhDong);
                lichSuHoaDon.setGhiChu(hanhDong + " trạng thái hóa đơn(" + trangThai + ") \n" +
                        "Lý do: " + lyDo);
                lichSuHoaDon.setNgayTao(LocalDateTime.now());
                lichSuHoaDon.setNguoiTao("Mai The Phong");
                lichSuHoaDonRepository.save(lichSuHoaDon);
                return true;
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    //Chuyển đổi sang object có những thông tin bên Hóa Đơn Chi Tiết
    private HoaDonChiTietResponseDTO.HoaDonChiTietDTO convertHoaDonChiTietToDTO(HoaDon hoaDon) {

        List<HoaDonChiTietResponseDTO.ThanhToanHoaDonDTO> listThanhToan = hoaDon.getListThanhToanHoaDon().stream()
                .sorted(Comparator.comparing(
                        ThanhToanHoaDon::getNgayTao,
                        Comparator.nullsLast(Comparator.reverseOrder()) // Đưa null xuống cuối danh sách
                ))
                .map(tt -> new HoaDonChiTietResponseDTO.ThanhToanHoaDonDTO(tt.getId(), tt.getSoTienThanhToan(), tt.getNgayTao(), tt.getPhuongThucThanhToan().getTenPhuongThuc(), tt.getNguoiTao(), tt.getGhiChu()))
                .collect(Collectors.toList());


        List<HoaDonChiTietResponseDTO.DanhSachSanPhamDTO> listDanhSachSanPham = hoaDon.getListHoaDonChiTiet().stream()
                .sorted(Comparator.comparing(
                        HoaDonChiTiet::getNgayTao,
                        Comparator.nullsLast(Comparator.reverseOrder()) // Đưa null xuống cuối danh sách
                ))
                .map(hdct -> new HoaDonChiTietResponseDTO.DanhSachSanPhamDTO(hdct.getId(), listURLAnhSanPhamChiTiet(hdct.getSanPhamChiTiet().getListAnh()), hdct.getSanPhamChiTiet().getSanPham().getTenSanPham() + hdct.getSanPhamChiTiet().getMauSac().getTenMauSac() + " size " + hdct.getSanPhamChiTiet().getSize().getTenSize(), hdct.getSanPhamChiTiet().getId(), hdct.getSanPhamChiTiet().getMa(), hdct.getDonGia(), hdct.getSoLuong(), hdct.getDonGia() * hdct.getSoLuong()))
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
                hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId()),
                hoaDon.getPhiShip(),
                maPhieuGiamGia,
                hoaDon.getTrangThai(),
                hoaDon.getNgayTao(),
                listThanhToan,
                listDanhSachSanPham,
                listLichSuHoaDon
        );
    }

    //Chuyển đổi sang object có những thông tin bên Hoa Đơn
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

    //Lấy listHoaDonTaiQuay chuyển đổi object sang DTO
    public List<HoaDonChiTietResponseDTO.HoaDonChiTietDTO> getHoaDonChiTietTaiQuay() {
        List<HoaDon> hoaDons = hoaDonRepository.getHoaDonByTrangThaiAndLoaiDonOrderByNgayTaoAsc("Chờ thanh toán", "Tại quầy");
        return hoaDons.stream().map(this::convertHoaDonChiTietToDTO).collect(Collectors.toList());
    }


}
