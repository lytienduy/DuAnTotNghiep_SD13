package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.dto.OrderStatusStatsDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;
    @Autowired
    private LichSuHoaDonRepository lichSuHoaDonRepository;

    @Autowired
    private ThanhToanHoaDonRepository thanhToanHoaDonRepository;

    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;

    @Autowired
    private KhachHangRepository khachHangRepository;

    //Hầm lấy tất cả trả về List<HoaDonResponseDTO>
    public List<HoaDonResponseDTO> getAllHoaDons() {
        List<HoaDon> hoaDons = hoaDonRepository.findAll();
        return hoaDons.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    //Hàm lấy listCount số lượng hóa đơn của từng trạng thái theo listHoaDon theo bộ lọc
    public List<Integer> laySoLuongHoaDonTrangThaiVaHoaDon(String timKiem, String tuNgay, String denNgay, String loaiDon) {
        // Các trạng thái cần đếm
        String[] trangThais;
        if ("online".equalsIgnoreCase(loaiDon)) {
            trangThais = new String[]{
                    "Chờ xác nhận", "Đã xác nhận", "Chờ giao hàng", "Đang vận chuyển",
                    "Đã giao hàng", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành", "Đã hủy"
            };
        } else {
            trangThais = new String[]{
                    "Chờ thêm sản phẩm", "Chờ xác nhận", "Đã xác nhận", "Chờ giao hàng", "Đang vận chuyển",
                    "Đã giao hàng", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành", "Đã hủy"
            };
        }

        List<HoaDonResponseDTO> listHoaDonHienTaiDangFill = locHoaDon(timKiem, tuNgay, denNgay, loaiDon, null);
        List<Integer> counts = new ArrayList<>();
        counts.add(listHoaDonHienTaiDangFill.size());

        Arrays.stream(trangThais)
                .map(status -> (int) listHoaDonHienTaiDangFill.stream().filter(hd -> hd.getTrangThai().equalsIgnoreCase(status)).count())
                .forEach(counts::add);
        List<String> trangThaisCheckHoan = Arrays.asList("Hoàn thành", "Đã hủy", "Chờ xác nhận");
        List<HoaDon> listHoaDonHoan = hoaDonRepository.timKiemHoaDonChoHoanTien(trangThaisCheckHoan, "Online").stream()
                .filter(hd -> {
                    float tongThanhToan = (float) hd.getListThanhToanHoaDon().stream()
                            .filter(tt -> tt.getLoai() == null || tt.getLoai().equalsIgnoreCase("Thanh toán"))
                            .mapToDouble(tt -> tt.getSoTienThanhToan()) // float to double
                            .sum();

                    float tongHoanTien = (float) hd.getListThanhToanHoaDon().stream()
                            .filter(tt -> tt.getLoai() != null && tt.getLoai().equalsIgnoreCase("Hoàn tiền"))
                            .mapToDouble(tt -> tt.getSoTienThanhToan())
                            .sum();

                    float soTienThuc = tongThanhToan - tongHoanTien;

                    return soTienThuc > hd.getTongTien();
                })
                .collect(Collectors.toList());
        counts.add(listHoaDonHoan.size());
        return counts;
    }

    //Hàm lọc hóa đơn trả về List HoaDonDTO bên hóa đơn
    public List<HoaDonResponseDTO> locHoaDon(String timKiem, String tuNgay, String denNgay, String loaiDon, String trangThai) {

        if (trangThai != null && trangThai.equalsIgnoreCase("Chờ hoàn tiền")) {
            List<String> trangThaisCheckHoan = Arrays.asList("Hoàn thành", "Đã hủy", "Chờ xác nhận");
            List<HoaDon> listHoaDonHoan = hoaDonRepository.timKiemHoaDonChoHoanTien(trangThaisCheckHoan, "Online").stream()
                    .filter(hd -> {
                        float tongThanhToan = (float) hd.getListThanhToanHoaDon().stream()
                                .filter(tt -> tt.getLoai() == null || tt.getLoai().equalsIgnoreCase("Thanh toán"))
                                .mapToDouble(tt -> tt.getSoTienThanhToan()) // float to double
                                .sum();

                        float tongHoanTien = (float) hd.getListThanhToanHoaDon().stream()
                                .filter(tt -> tt.getLoai() != null && tt.getLoai().equalsIgnoreCase("Hoàn tiền"))
                                .mapToDouble(tt -> tt.getSoTienThanhToan())
                                .sum();

                        float soTienThuc = tongThanhToan - tongHoanTien;

                        return soTienThuc > hd.getTongTien();
                    })
                    .collect(Collectors.toList());
            return listHoaDonHoan.stream().map(this::convertToDTO).collect(Collectors.toList());

        }
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
    @Transactional
    public Boolean capNhatTrangThaiHoaDon(Integer idHoaDon, String trangThai, String hanhDong, String lyDo,String tenUser) {
//        List<String> cacTrangThaiCanCapNhat = new ArrayList<>();
//        cacTrangThaiCanCapNhat.add(trangThai);
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).get();
        if (trangThai.equalsIgnoreCase("Đã hủy")) {
            if (hoaDon.getLoaiDon().equalsIgnoreCase("Tại quầy")) {
                for (HoaDonChiTiet hoaDonChiTiet : hoaDonChiTietRepository.getHoaDonChiTietByHoaDonAndTrangThaiOrderByNgayTaoDesc(hoaDon, "Hoạt động")
                ) {
                    SanPhamChiTiet sanPhamChiTiet = hoaDonChiTiet.getSanPhamChiTiet();
                    sanPhamChiTiet.setSoLuong((sanPhamChiTiet.getSoLuong() + hoaDonChiTiet.getSoLuong()));
                    sanPhamChiTietRepositoryP.save(sanPhamChiTiet);
                }
            }
        }
//        ĐÃ FIX
        if (trangThai.equalsIgnoreCase("Đã xác nhận")) {
            if (hoaDon.getLoaiDon().equalsIgnoreCase("Online")) {
                for (HoaDonChiTiet hoaDonChiTiet : hoaDonChiTietRepository.getHoaDonChiTietByHoaDonAndTrangThaiOrderByNgayTaoDesc(hoaDon, "Hoạt động")
                ) {
                    SanPhamChiTiet sanPhamChiTiet = hoaDonChiTiet.getSanPhamChiTiet();
                    if (sanPhamChiTiet.getSoLuong() < hoaDonChiTiet.getSoLuong()) {
                        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                        return false;
                    }
                    sanPhamChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong() - hoaDonChiTiet.getSoLuong());
                    sanPhamChiTietRepositoryP.save(sanPhamChiTiet);
                }
            }
        }
        if (trangThai.equalsIgnoreCase("Đã giao hàng")) {
            double soTienKhachDaThanhToan = hoaDon.getListThanhToanHoaDon()
                    .stream()
                    .mapToDouble(tt ->
                            tt.getLoai().equalsIgnoreCase("Hoàn tiền")
                                    ? -tt.getSoTienThanhToan()
                                    : tt.getSoTienThanhToan())
                    .sum();
            if (soTienKhachDaThanhToan >= hoaDon.getTongTien()) {
                trangThai = "Đã thanh toán";
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
                lichSuHoaDon.setNguoiTao(tenUser);
                lichSuHoaDon.setNguoiSua(tenUser);
                lichSuHoaDonRepository.save(lichSuHoaDon);
                return true;
            }
        } catch (Exception e) {
            return false;
        }
        return false;
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

    //Chuyển đổi sang object có những thông tin bên Hoa Đơn
    private HoaDonResponseDTO convertToDTO(HoaDon hoaDon) {
        String maKhachHang = null;
        String tenKhachHang = null;
        String sdtKhachHang = null;
        if (hoaDon.getKhachHang() != null) {
            maKhachHang = hoaDon.getKhachHang().getMa();
            tenKhachHang = hoaDon.getKhachHang().getTenKhachHang();
            sdtKhachHang = hoaDon.getKhachHang().getSdt();
        }
        return new HoaDonResponseDTO(
                hoaDon.getId(),
                hoaDon.getMa(),
                maKhachHang,
                tenKhachHang,
                sdtKhachHang,
                hoaDon.getLoaiDon(),
                hoaDon.getNgayTao(),
                hoaDon.getTrangThai(),
                hoaDon.getTongTien()
        );
    }

    //Lấy listHoaDonTaiQuay chuyển đổi object sang DTO
    public List<HoaDonChiTietResponseDTO.HoaDonChiTietDTO> getHoaDonChiTietTaiQuay() {
        List<String> trangThais = Arrays.asList("Chờ thêm sản phẩm");//Nếu là chờ thêm sản phẩm mới show ra
        List<HoaDon> hoaDons = hoaDonRepository.getHoaDonByTrangThaiInAndLoaiDonOrderByNgayTaoAsc(trangThais, "Tại quầy");
        return hoaDons.stream().map(this::convertHoaDonChiTietToDTO).collect(Collectors.toList());
    }


    //Thống kê

    private List<OrderStatusStatsDTO> convertToDTO(List<Object[]> rawData) {
        return rawData.stream().map(row -> {
            String trangThai = row[0] != null ? row[0].toString() : "";
            int soLuong = row[1] != null ? Integer.parseInt(row[1].toString()) : 0;
            return new OrderStatusStatsDTO(trangThai, soLuong);
        }).collect(Collectors.toList());
    }

    public List<OrderStatusStatsDTO> getOrderStatusStatsToday() {
        List<Object[]> rawData = hoaDonRepository.findOrderStatusStatsToday();
        return convertToDTO(rawData);
    }

    public List<OrderStatusStatsDTO> getOrderStatusStatsThisWeek() {
        List<Object[]> rawData = hoaDonRepository.findOrderStatusStatsThisWeek();
        return convertToDTO(rawData);
    }

    public List<OrderStatusStatsDTO> getOrderStatusStatsThisMonth() {
        List<Object[]> rawData = hoaDonRepository.findOrderStatusStatsThisMonth();
        return convertToDTO(rawData);
    }

    public List<OrderStatusStatsDTO> getOrderStatusStatsThisYear() {
        List<Object[]> rawData = hoaDonRepository.findOrderStatusStatsThisYear();
        return convertToDTO(rawData);
    }

    public List<OrderStatusStatsDTO> getOrderStatusStatsCustom(String startDate, String endDate) {
        List<Object[]> rawData = hoaDonRepository.findOrderStatusStatsCustom(startDate, endDate);
        return rawData.stream().map(row -> {
            String trangThai = row[0] != null ? row[0].toString() : "";
            int soLuong = row[1] != null ? Integer.parseInt(row[1].toString()) : 0;
            return new OrderStatusStatsDTO(trangThai, soLuong);
        }).collect(Collectors.toList());
    }

    // Lưu thông tin hóa đơn đã cập nhật
    public HoaDon saveHoaDon(HoaDon hoaDon) {
        return hoaDonRepository.save(hoaDon);
    }

    // Lưu lịch sử hóa đơn
    public LichSuHoaDon saveLichSuHoaDon(LichSuHoaDon lichSuHoaDon) {
        return lichSuHoaDonRepository.save(lichSuHoaDon);
    }

    // Phương thức lấy hóa đơn theo id
    public HoaDon getHoaDonByIdHD(Integer id) {
        Optional<HoaDon> hoaDon = hoaDonRepository.findById(id); // Sử dụng findById để tìm hóa đơn theo id
        return hoaDon.orElse(null); // Trả về null nếu không tìm thấy hóa đơn
    }
}
