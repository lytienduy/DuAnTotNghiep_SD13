package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.entity.LichSuHoaDon;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import com.example.shopdragonbee.repository.HoaDonRepository;
import com.example.shopdragonbee.repository.LichSuHoaDonRepository;
import com.example.shopdragonbee.repository.ThanhToanHoaDonRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
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

    public List<HoaDonResponseDTO> getAllHoaDons() {
        List<HoaDon> hoaDons = hoaDonRepository.findAll();
        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

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

    public HoaDonChiTietResponseDTO.HoaDonDTO getHoaDonById(Integer id) {
        return convertHoaDonChiTietToDTO(hoaDonRepository.findById(id).get());
    }

    public List<String> listURLAnhSanPhamChiTiet(List<AnhSanPham> list) {
        List<String> listUrl = new ArrayList<>();
        for (AnhSanPham anh : list
        ) {
            listUrl.add(anh.getAnhUrl());
        }
        return listUrl;
    }


    public Boolean capNhatTrangThaiHoaDon(Integer idHoaDon, String trangThai, String hanhDong, String lyDo) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).get();
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


//    public Float tinhToanVoucherGiaDuocGiam(PhieuGiamGia phieuGiamGia,Float tienSanPham){
//        if(phieuGiamGia.getLoaiPhieuGiamGia().equalsIgnoreCase("Phần trăm")){
//            if(tienSanPham * phieuGiamGia.getGiaTriGiam()/100 > s){
//
//            }
//        }else if(phieuGiamGia.getLoaiPhieuGiamGia().equalsIgnoreCase("Cố định")){
//
//        }
//    }

    private HoaDonChiTietResponseDTO.HoaDonDTO convertHoaDonChiTietToDTO(HoaDon hoaDon) {

        List<HoaDonChiTietResponseDTO.ThanhToanHoaDonDTO> listThanhToan = hoaDon.getListThanhToanHoaDon().stream()
                .map(tt -> new HoaDonChiTietResponseDTO.ThanhToanHoaDonDTO(tt.getId(), tt.getSoTienThanhToan(), tt.getNgayTao(), tt.getPhuongThucThanhToan().getTenPhuongThuc(), tt.getNguoiTao(), tt.getGhiChu()))
                .collect(Collectors.toList());


        List<HoaDonChiTietResponseDTO.DanhSachSanPhamDTO> listDanhSachSanPham = hoaDon.getListHoaDonChiTiet().stream()
                .map(hdct -> new HoaDonChiTietResponseDTO.DanhSachSanPhamDTO(hdct.getId(), listURLAnhSanPhamChiTiet(hdct.getSanPhamChiTiet().getListAnh()), hdct.getSanPhamChiTiet().getSanPham().getTenSanPham() + hdct.getSanPhamChiTiet().getMauSac().getTenMauSac() + " size " + hdct.getSanPhamChiTiet().getSize().getTenSize(), hdct.getSanPhamChiTiet().getMa(), hdct.getDonGia(), hdct.getSoLuong(), hdct.getDonGia() * hdct.getSoLuong()))
                .collect(Collectors.toList());

        List<HoaDonChiTietResponseDTO.LichSuHoaDonDTO> listLichSuHoaDon = hoaDon.getListLichSuHoaDon().stream()
                .map(lshd -> new HoaDonChiTietResponseDTO.LichSuHoaDonDTO(lshd.getId(), lshd.getHanhDong(), lshd.getGhiChu(), lshd.getNgayTao(), lshd.getNguoiTao()))
                .collect(Collectors.toList());


        String maPhieuGiamGia = null;
        if (hoaDon.getPhieuGiamGia() != null) {
            maPhieuGiamGia = hoaDon.getPhieuGiamGia().getMa();
        }
        return new HoaDonChiTietResponseDTO.HoaDonDTO(
                hoaDon.getId(),
                hoaDon.getMa(),
                hoaDon.getLoaiDon(),
                hoaDon.getGhiChu(),
                hoaDon.getTenNguoiNhan(),
                hoaDon.getSdt(),
                hoaDon.getEmailNguoiNhan(),
                hoaDon.getDiaChiNhanHang(),
                hoaDon.getKhachHang().getMa(),
                hoaDon.getKhachHang().getTenKhachHang(),
                hoaDon.getKhachHang().getSdt(),
                hoaDon.getTongTien(),
                hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId()),
                hoaDon.getPhiShip(),
                maPhieuGiamGia,
                hoaDon.getTrangThai(),
                listThanhToan,
                listDanhSachSanPham,
                listLichSuHoaDon
//                thanhToanHoaDonRepository.tinhTongTienDaThanhToanByHoaDonId(hoaDon.getId())
        );
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
