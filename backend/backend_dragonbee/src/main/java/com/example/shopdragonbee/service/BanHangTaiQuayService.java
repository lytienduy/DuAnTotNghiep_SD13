package com.example.shopdragonbee.service;

import ch.qos.logback.core.util.ExecutorServiceUtil;
import com.example.shopdragonbee.dto.BanHangTaiQuayResponseDTO;
import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.*;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BanHangTaiQuayService {
    @Autowired
    private HoaDonRepository hoaDonRepository;


    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepository;

    @Autowired
    private DanhMucRepositoryP danhMucRepositoryP;
    @Autowired
    private MauSacRepositoryP mauSacRepositoryP;
    @Autowired
    private ChatLieuRepositoryP chatLieuRepositoryP;
    @Autowired
    private SizeRepositoryP sizeRepositoryP;
    @Autowired
    private KieuDangRepositoryP kieuDangRepositoryP;
    @Autowired
    private ThuongHieuRepositoryP thuongHieuRepositoryP;
    @Autowired
    private PhongCachRepositoryP phongCachRepositoryP;
    @Autowired
    private PhuongThucThanhToanRepository phuongThucThanhToanRepository;
    @Autowired
    private ThanhToanHoaDonRepository thanhToanHoaDonRepository;
    @Autowired
    private KhachHangRepository khachHangRepository;
    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    @Autowired
    private HoaDonService hoaDonService;

    //Tạo hóa đơn tại quầy
    public HoaDon taoHoaDon() {
        try {
            HoaDon hoaDon = new HoaDon();
            hoaDon.setMa("HD" + (System.currentTimeMillis() % 100000));
            hoaDon.setLoaiDon("Tại quầy");
            hoaDon.setTrangThai("Chờ thêm sản phẩm");
            hoaDon.setNgayTao(LocalDateTime.now());
            //Chú lại đoạn này nên set 0 hay set null
            hoaDon.setTongTien(null);
            hoaDon.setPhiShip(null);
            return hoaDonRepository.save(hoaDon);
        } catch (Exception e) {
            return null;
        }
    }

    //Tăng số lượng
    public Boolean tangSoLuong(Integer id) {
        try {
            HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(hoaDonChiTiet.getSanPhamChiTiet().getId()).get();
            int soLuongConLai = (sanPhamChiTiet.getSoLuong() + hoaDonChiTiet.getSoLuong()) - (hoaDonChiTiet.getSoLuong() + 1);
            if (soLuongConLai >= 0) {
                sanPhamChiTiet.setSoLuong(soLuongConLai);
                sanPhamChiTietRepository.save(sanPhamChiTiet);
                hoaDonChiTiet.setSoLuong(hoaDonChiTiet.getSoLuong() + 1);
                hoaDonChiTietRepository.save(hoaDonChiTiet);
                HoaDon hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getHoaDon().getId()).get();
                hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId())+ (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
                hoaDonRepository.save(hoaDon);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    //Nhập số lượng từ bàn phím
    public Boolean nhapSoLuong(Integer id, Integer soLuong) {
        try {
            HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(hoaDonChiTiet.getSanPhamChiTiet().getId()).get();
//            if(soLuong > 0){
            int soLuongConLai = (sanPhamChiTiet.getSoLuong() + hoaDonChiTiet.getSoLuong()) - soLuong;
            if (soLuongConLai >= 0) {
                sanPhamChiTiet.setSoLuong(soLuongConLai);
                sanPhamChiTietRepository.save(sanPhamChiTiet);
                hoaDonChiTiet.setSoLuong(soLuong);
                hoaDonChiTietRepository.save(hoaDonChiTiet);
                HoaDon hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getHoaDon().getId()).get();
                hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId())+ (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
                hoaDonRepository.save(hoaDon);
            } else {
                // Phải cập nhật hóa đơn chi tiết trước sản phẩm chi tiết
                hoaDonChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong() + hoaDonChiTiet.getSoLuong());
                hoaDonChiTietRepository.save(hoaDonChiTiet);
                sanPhamChiTiet.setSoLuong(0);
                sanPhamChiTietRepository.save(sanPhamChiTiet);
                HoaDon hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getHoaDon().getId()).get();
                hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId())+ (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
                hoaDonRepository.save(hoaDon);
                return false;
            }
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    //Giảm số lượng
    public Boolean giamSoLuong(Integer id) {
        try {
            HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(hoaDonChiTiet.getSanPhamChiTiet().getId()).get();
            if (hoaDonChiTiet.getSoLuong() > 1) {
                sanPhamChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong() + 1);
                sanPhamChiTietRepository.save(sanPhamChiTiet);
                hoaDonChiTiet.setSoLuong(hoaDonChiTiet.getSoLuong() - 1);
                hoaDonChiTietRepository.save(hoaDonChiTiet);
                HoaDon hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getHoaDon().getId()).get();
                hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId()) + (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
                hoaDonRepository.save(hoaDon);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    //Xóa sản phẩm khỏi giỏ hàng bán hàng tại quầy
    public Boolean xoaSanPham(Integer id, Integer idHoaDon) {
        try {
            HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(hoaDonChiTiet.getSanPhamChiTiet().getId()).get();
            sanPhamChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong() + hoaDonChiTiet.getSoLuong());
            sanPhamChiTietRepository.save(sanPhamChiTiet);
            hoaDonChiTietRepository.delete(hoaDonChiTiet);
            HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).get();
            if (hoaDon.getListHoaDonChiTiet().isEmpty() || hoaDon.getListHoaDonChiTiet() == null) {
                hoaDon.setTrangThai("Chờ thêm sản phẩm");
                hoaDonRepository.save(hoaDon); // Lưu lại trạng thái mới
//                HoaDon hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getHoaDon().getId()).get();
                hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId()) + (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
                hoaDonRepository.save(hoaDon);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
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

    //Lấy các sản phẩm
    public List<BanHangTaiQuayResponseDTO.SanPhamHienThiTrongThemBanHangTaiQuay> getListCacSanPhamHienThiTrongThemBanHangTaiQuay(
            String searchText,
            Integer fromGia,
            Integer toGia,
            Integer danhMuc,
            Integer mauSac,
            Integer chatLieu,
            Integer kichCo,
            Integer kieuDang,
            Integer thuongHieu,
            Integer phongCach) {
        List<SanPhamChiTiet> listSanPham = sanPhamChiTietRepository.findAll((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (searchText != null && !searchText.trim().isEmpty()) {
                String searchLower = searchText.toLowerCase().trim();

                // Kiểm tra nếu searchText có thể là mã sản phẩm (ví dụ: 10001, QANAM32)
                Predicate byMa = criteriaBuilder.like(criteriaBuilder.lower(root.get("ma")), "%" + searchLower + "%");

                // Tạo chuỗi chứa thông tin tìm kiếm (tất cả viết thường)
                Expression<String> tenSanPhamChiTiet = criteriaBuilder.lower(
                        criteriaBuilder.function(
                                "concat",
                                String.class,
                                root.get("sanPham").get("tenSanPham"),
                                criteriaBuilder.literal(" "),
                                root.get("size").get("tenSize"),
                                criteriaBuilder.literal(" "),
                                root.get("mauSac").get("tenMauSac"),
                                criteriaBuilder.literal(" ")
                        )
                );

                tenSanPhamChiTiet = criteriaBuilder.lower(
                        criteriaBuilder.concat(
                                criteriaBuilder.concat(
                                        criteriaBuilder.concat(
                                                tenSanPhamChiTiet, root.get("kieuDang").get("tenKieuDang")), " "),
                                root.get("thuongHieu").get("tenThuongHieu"))
                );

                // Tách từ khóa và tìm kiếm từng từ
                String[] keywords = searchLower.split("\\s+");
                List<Predicate> keywordPredicates = new ArrayList<>();
                for (String word : keywords) {
                    keywordPredicates.add(criteriaBuilder.like(tenSanPhamChiTiet, "%" + word + "%"));
                }
                // Tạo điều kiện OR: tìm theo mã hoặc tìm theo từ khóa
                predicates.add(criteriaBuilder.or(
                        byMa,
                        criteriaBuilder.and(keywordPredicates.toArray(new Predicate[0]))
                ));
            }
            Predicate datePredicate = criteriaBuilder.between(
                    root.get("gia"), fromGia, toGia
            );
            predicates.add(datePredicate);
            if (danhMuc != 0) {
                predicates.add(criteriaBuilder.equal(root.get("danhMuc").get("id"), danhMuc));
            }
            if (mauSac != 0) {
                predicates.add(criteriaBuilder.equal(root.get("mauSac").get("id"), mauSac));
            }
            if (chatLieu != 0) {
                predicates.add(criteriaBuilder.equal(root.get("chatLieu").get("id"), chatLieu));
            }
            if (kichCo != 0) {
                predicates.add(criteriaBuilder.equal(root.get("size").get("id"), kichCo));
            }
            if (kieuDang != 0) {
                predicates.add(criteriaBuilder.equal(root.get("kieuDang").get("id"), kieuDang));
            }
            if (thuongHieu != 0) {
                predicates.add(criteriaBuilder.equal(root.get("thuongHieu").get("id"), thuongHieu));
            }
            if (phongCach != 0) {
                predicates.add(criteriaBuilder.equal(root.get("phongCach").get("id"), phongCach));
            }
            predicates.add(criteriaBuilder.notEqual(root.get("trangThai"), "Ngừng hoạt động"));
            query.orderBy(criteriaBuilder.desc(root.get("ngayTao")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
        return listSanPham.stream().map(this::convertSanPhamHienThiTrongThemBanHangTaiQuayToDTO).collect(Collectors.toList());
    }


    //Chuyển đổi sang object có những thông tin bên Hóa Đơn Chi Tiết
    public BanHangTaiQuayResponseDTO.SanPhamHienThiTrongThemBanHangTaiQuay convertSanPhamHienThiTrongThemBanHangTaiQuayToDTO(SanPhamChiTiet sanPhamChiTiet) {
        return new BanHangTaiQuayResponseDTO.SanPhamHienThiTrongThemBanHangTaiQuay(
                sanPhamChiTiet.getId(),
                sanPhamChiTiet.getMa(),
                listURLAnhSanPhamChiTiet(sanPhamChiTiet.getListAnh()),
                sanPhamChiTiet.getSanPham().getTenSanPham() + " " + sanPhamChiTiet.getMauSac().getTenMauSac() + " size " + sanPhamChiTiet.getSize().getTenSize(),
                sanPhamChiTiet.getChatLieu().getTenChatLieu(),
                sanPhamChiTiet.getDanhMuc().getTenDanhMuc(),
                sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getXuatXu().getTenXuatXu(),
                sanPhamChiTiet.getKieuDang().getTenKieuDang(),
                sanPhamChiTiet.getPhongCach().getTenPhongCach(),
                sanPhamChiTiet.getGia(),
                sanPhamChiTiet.getSoLuong(),
                sanPhamChiTiet.getTrangThai()
        );
    }


    //Lấy list toàn bộ lọc sản phẩm
    public BanHangTaiQuayResponseDTO.LuuListCacBoLocThemSanPham getToanBoListBoLoc() {
        return new BanHangTaiQuayResponseDTO.LuuListCacBoLocThemSanPham(danhMucRepositoryP.findAll(), mauSacRepositoryP.findAll(), chatLieuRepositoryP.findAll(), sizeRepositoryP.findAll(), kieuDangRepositoryP.findAll(), thuongHieuRepositoryP.findAll(), phongCachRepositoryP.findAll());
    }


    //Add sản phẩm vào giỏ hàng
    public Boolean addSanPhamVaoGioHang(Integer idHoaDon, Integer idSanPhamChiTiet, Integer soLuong, Float donGia) {
        try {
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(idSanPhamChiTiet).get();
            HoaDonChiTiet kiemTraHDCTDaCoChua = hoaDonChiTietRepository.getHoaDonChiTietByHoaDonAndSanPhamChiTietAndDonGia(hoaDonRepository.findById(idHoaDon).get(), sanPhamChiTietRepository.findById(idSanPhamChiTiet).get(), donGia);

            if (kiemTraHDCTDaCoChua == null) {
                HoaDonChiTiet hoaDonChiTiet = new HoaDonChiTiet();
                hoaDonChiTiet.setMa("HDCT" + (System.currentTimeMillis() % 100000));
                hoaDonChiTiet.setHoaDon(hoaDonRepository.findById(idHoaDon).get());
                hoaDonChiTiet.setSanPhamChiTiet(sanPhamChiTietRepository.findById(idSanPhamChiTiet).get());
                sanPhamChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong() - soLuong);
                hoaDonChiTiet.setSoLuong(soLuong);
                hoaDonChiTiet.setDonGia(donGia);
                hoaDonChiTiet.setNgayTao(LocalDateTime.now());
                hoaDonChiTietRepository.save(hoaDonChiTiet);//lưu hóa đơn chi tiết
                sanPhamChiTietRepository.save(sanPhamChiTiet);//set lại số lượng sản phẩm chi tiết
            } else {
                kiemTraHDCTDaCoChua.setSoLuong(kiemTraHDCTDaCoChua.getSoLuong() + soLuong);
                sanPhamChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong() - soLuong);
                kiemTraHDCTDaCoChua.setDonGia(donGia);
                kiemTraHDCTDaCoChua.setNgaySua(LocalDateTime.now());
                hoaDonChiTietRepository.save(kiemTraHDCTDaCoChua);//lưu hóa đơn chi tiết
                sanPhamChiTietRepository.save(sanPhamChiTiet);//set lại số lượng sản phẩm chi tiết
            }
            HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).get();
            hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId()) + (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
            hoaDonRepository.save(hoaDon);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean thanhToanHoaDon(Integer idHoaDon, String pttt, Float tienMat, Float chuyenKhoan) {
        try {
            ThanhToanHoaDon thanhToanHoaDonTienMat = new ThanhToanHoaDon();
            thanhToanHoaDonTienMat.setMa("TTHD" + (System.currentTimeMillis() % 100000));
            thanhToanHoaDonTienMat.setHoaDon(hoaDonRepository.findById(idHoaDon).get());
            thanhToanHoaDonTienMat.setPhuongThucThanhToan(phuongThucThanhToanRepository.findById(1).get());
            thanhToanHoaDonTienMat.setSoTienThanhToan(tienMat);
            thanhToanHoaDonTienMat.setNgayTao(LocalDateTime.now());
            thanhToanHoaDonRepository.save(thanhToanHoaDonTienMat);

            ThanhToanHoaDon thanhToanHoaDonChuyenKhoan = new ThanhToanHoaDon();
            thanhToanHoaDonChuyenKhoan.setMa("TTHD" + (System.currentTimeMillis() % 100000));
            thanhToanHoaDonChuyenKhoan.setHoaDon(hoaDonRepository.findById(idHoaDon).get());
            thanhToanHoaDonChuyenKhoan.setPhuongThucThanhToan(phuongThucThanhToanRepository.findById(2).get());//Chuyển khoản
            thanhToanHoaDonChuyenKhoan.setSoTienThanhToan(chuyenKhoan);
            thanhToanHoaDonChuyenKhoan.setNgayTao(LocalDateTime.now());
            thanhToanHoaDonRepository.save(thanhToanHoaDonChuyenKhoan);

            if (pttt.equalsIgnoreCase("cash")) {
                thanhToanHoaDonRepository.save(thanhToanHoaDonTienMat);
            } else if (pttt.equalsIgnoreCase("transfer")) {
                thanhToanHoaDonRepository.save(thanhToanHoaDonChuyenKhoan);
            } else if (pttt.equalsIgnoreCase("both")) {
                thanhToanHoaDonRepository.save(thanhToanHoaDonTienMat);
                thanhToanHoaDonRepository.save(thanhToanHoaDonChuyenKhoan);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public HoaDonChiTietResponseDTO.HoaDonChiTietDTO xacNhanDatHang(Integer idHoaDon, Integer idKhachHang, String pgg, Boolean giaoHang, String tenNguoiNhan, String sdtNguoiNhan, String diaChiNhanHang, Float tongTienPhaiTra, Float phiShip) {
        try {
            HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).get();
            if (idKhachHang != null) {
                hoaDon.setKhachHang(khachHangRepository.findById(idKhachHang).get());
            }
            if (pgg != null && pgg.trim().isBlank() == false) {
                PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository.findByMa(pgg.trim()).get();
                phieuGiamGia.setSoLuong(phieuGiamGia.getSoLuong() - 1);
                hoaDon.setPhieuGiamGia(phieuGiamGia);
            }
            if (giaoHang == true) {
                hoaDon.setTenNguoiNhan(tenNguoiNhan);
                hoaDon.setSdt(sdtNguoiNhan);
                hoaDon.setDiaChiNhanHang(diaChiNhanHang);
                hoaDon.setPhiShip(phiShip);
                hoaDon.setTrangThai("Chờ xác nhận");
            } else {
                hoaDon.setTrangThai("Đã thanh toán");
            }
            hoaDon.setTongTien(tongTienPhaiTra);

            return hoaDonService.convertHoaDonChiTietToDTO(hoaDonRepository.save(hoaDon));
        } catch (Exception e) {
            return null;
        }
    }
}
