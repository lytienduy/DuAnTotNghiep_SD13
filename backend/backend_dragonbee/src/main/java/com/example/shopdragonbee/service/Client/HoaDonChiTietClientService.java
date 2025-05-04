package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.BanHangTaiQuayResponseDTO;
import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.*;
import com.example.shopdragonbee.service.HoaDonService;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HoaDonChiTietClientService {
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
    private LichSuHoaDonRepository lichSuHoaDonRepository;
    @Autowired
    private GioHangChiTietRepository gioHangChiTietRepository;
    @Autowired
    private GioHangRepository gioHangRepository;
    @Autowired
    private HoaDonService hoaDonService;

    public void luuLichSuHoaDon(HoaDon hoaDon, String hanhDong, SanPhamChiTiet sanPhamChiTiet) {
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(hoaDon);
        lichSuHoaDon.setHanhDong(hanhDong);
        lichSuHoaDon.setGhiChu(hanhDong + sanPhamChiTiet.getSanPham().getTenSanPham() + sanPhamChiTiet.getMauSac().getTenMauSac() + " size " + sanPhamChiTiet.getSize().getTenSize());
        lichSuHoaDon.setNgayTao(LocalDateTime.now());
        //Chưa làm lưu người hành động
//    lichSuHoaDon.setNguoiTao();
        lichSuHoaDonRepository.save(lichSuHoaDon);
    }

    public List<String> listURLAnhSanPhamChiTiet(List<AnhSanPham> list) {
        List<String> listUrl = new ArrayList<>();
        for (AnhSanPham anh : list
        ) {
            listUrl.add(anh.getAnhUrl());
        }
        return listUrl;
    }

    @Transactional
    public String tangSoLuongOnline(Integer id) {
        HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
        //Trừ với số lượng spct đã có trong hdct
        Integer soLuongSPtrongHDCT = hoaDonChiTietRepository.getTongSoluongSanPhamTheoHoaDonVaSPCTVaTrangThai(hoaDonChiTiet.getHoaDon(), hoaDonChiTiet.getSanPhamChiTiet(), "Hoạt động");
        Integer soLuongConLaiCuaSanPham = hoaDonChiTiet.getSanPhamChiTiet().getSoLuong() - soLuongSPtrongHDCT;
        if (soLuongConLaiCuaSanPham >= 1) {
            hoaDonChiTiet.setSoLuong(hoaDonChiTiet.getSoLuong() + 1);
            if (hoaDonChiTietRepository.save(hoaDonChiTiet).getSoLuong() > 30) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return "Có mặt hàng vượt quá số lượng 30";
            }
            HoaDon hoaDon = hoaDonChiTiet.getHoaDon();
            hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId(), "Hoạt động") + (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
            if (hoaDonRepository.save(hoaDon).getTongTien() > 20000000) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return "Đơn hàng vượt quá 20tr";
            }
            return "Ok";
        } else {
            return "Hết sản phẩm";
        }
    }

    //Nhập số lượng từ bàn phím
    @Transactional
    public String nhapSoLuongOnline(Integer id, Integer soLuong) {
        HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
        SanPhamChiTiet sanPhamChiTiet = hoaDonChiTiet.getSanPhamChiTiet();
        //Không cần trừ với giỏ hàng và hdct(ĐÃ FIX)
        int soLuongConLai = sanPhamChiTiet.getSoLuong() - soLuong;
        if (soLuongConLai >= 0) {
            hoaDonChiTiet.setSoLuong(soLuong);
            if (soLuong > 30) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return "Có mặt hàng vượt quá số lượng 30";
            }
            HoaDon hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getHoaDon().getId()).get();
            hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId(), "Hoạt động") + (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
            if (hoaDonRepository.save(hoaDon).getTongTien() > 20000000) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return "Đơn hàng vượt quá 20tr";
            }
        } else {
            // Phải cập nhật hóa đơn chi tiết trước sản phẩm chi tiết
            hoaDonChiTiet.setSoLuong(sanPhamChiTiet.getSoLuong());
            if (hoaDonChiTietRepository.save(hoaDonChiTiet).getSoLuong() > 30) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return "Có mặt hàng vượt quá số lượng 30";
            }
            HoaDon hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getHoaDon().getId()).get();
            hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId(), "Hoạt động") + (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
            if (hoaDonRepository.save(hoaDon).getTongTien() > 20000000) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return "Đơn hàng vượt quá 20tr";
            }
            return "Số lượng trong kho không đủ cung cấp hoàn toàn số lượng bạn muốn";
        }
        return "Ok";
    }

    //Giảm số lượng
    public Boolean giamSoLuongOnline(Integer id) {
        try {
            HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
            if (hoaDonChiTiet.getSoLuong() > 1) {
                hoaDonChiTiet.setSoLuong(hoaDonChiTiet.getSoLuong() - 1);
                hoaDonChiTietRepository.save(hoaDonChiTiet);
                HoaDon hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getHoaDon().getId()).get();
                hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId(), "Hoạt động") + (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
                hoaDonRepository.save(hoaDon);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }
    //Đang để xóa luôn không lưu lại gì nữa
    public Boolean xoaSanPhamOnline(Integer id, Integer idHoaDon) {
        try {
            HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
//            hoaDonChiTiet.setTrangThai("Không hoạt động");
//            hoaDonChiTietRepository.save(hoaDonChiTiet);
            hoaDonChiTietRepository.delete(hoaDonChiTiet);
            HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).get();
            if (hoaDon.getListHoaDonChiTiet().isEmpty() || hoaDon.getListHoaDonChiTiet() == null) {
                hoaDon.setTrangThai("Chờ thêm sản phẩm");
                hoaDonRepository.save(hoaDon); // Lưu lại trạng thái mới
            }
            hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId(), "Hoạt động") + (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
            hoaDonRepository.save(hoaDon);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean xoaSanPhamSauKhiDatHang(Integer id, Integer idHoaDon) {
        try {
            luuLichSuHoaDon(hoaDonRepository.findById(idHoaDon).get(), "Xóa sản phẩm", hoaDonChiTietRepository.findById(id).get().getSanPhamChiTiet());
            xoaSanPhamOnline(id, idHoaDon);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    //Add sản phẩm vào giỏ hàng(ĐÃ FIX)
    @Transactional
    public String addSanPhamVaoGioHangOnlineSauKhiDatHang(Integer idHoaDon, Integer idSanPhamChiTiet, Integer soLuong, Double donGia) {
        SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(idSanPhamChiTiet).get();
        //Trừ đi số lượng spct đã có trong hdct
        Integer soLuongSPtrongHDCT = hoaDonChiTietRepository.getTongSoluongSanPhamTheoHoaDonVaSPCTVaTrangThai(hoaDonRepository.findById(idHoaDon).get(), sanPhamChiTiet, "Hoạt động");
        Integer soLuongConLai = sanPhamChiTiet.getSoLuong() - soLuongSPtrongHDCT;
        //
        HoaDonChiTiet kiemTraHDCTDaCoChua = hoaDonChiTietRepository.getHoaDonChiTietByHoaDonAndSanPhamChiTietAndDonGiaAndTrangThai(hoaDonRepository.findById(idHoaDon).get(), sanPhamChiTietRepository.findById(idSanPhamChiTiet).get(), donGia, "Hoạt động");
        if (kiemTraHDCTDaCoChua == null) {
            HoaDonChiTiet hoaDonChiTiet = new HoaDonChiTiet();
            hoaDonChiTiet.setMa("HDCT" + (System.currentTimeMillis() % 100000));
            hoaDonChiTiet.setHoaDon(hoaDonRepository.findById(idHoaDon).get());
            hoaDonChiTiet.setSanPhamChiTiet(sanPhamChiTietRepository.findById(idSanPhamChiTiet).get());
            if (soLuongConLai - soLuong < 0) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return "Rất tiếc! không đủ số lượng sản phẩm";
            }
            hoaDonChiTiet.setSoLuong(soLuong);
            hoaDonChiTiet.setDonGia(donGia);
            hoaDonChiTiet.setNgayTao(LocalDateTime.now());
            hoaDonChiTiet.setTrangThai("Hoạt động");
            if (hoaDonChiTietRepository.save(hoaDonChiTiet).getSoLuong() > 30) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return "Có mặt hàng vượt quá số lượng 30";
            }
        } else {
            kiemTraHDCTDaCoChua.setSoLuong(kiemTraHDCTDaCoChua.getSoLuong() + soLuong);
            if (soLuongConLai - soLuong < 0) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return "Rất tiếc! không đủ số lượng sản phẩm";
            }
            kiemTraHDCTDaCoChua.setDonGia(donGia);
            kiemTraHDCTDaCoChua.setNgaySua(LocalDateTime.now());
            if (hoaDonChiTietRepository.save(kiemTraHDCTDaCoChua).getSoLuong() > 30) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return "Có mặt hàng vượt quá số lượng 30";
            }
        }
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).get();
        hoaDon.setTongTien(hoaDonRepository.tinhTongTienByHoaDonId(hoaDon.getId(), "Hoạt động") + (hoaDon.getPhiShip() != null ? hoaDon.getPhiShip() : 0));
        if (hoaDonRepository.save(hoaDon).getTongTien() > 20000000) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return "Đơn hàng vượt quá 20tr";
        }
        luuLichSuHoaDon(hoaDonRepository.findById(idHoaDon).get(), "Thêm sản phẩm", sanPhamChiTietRepository.findById(idSanPhamChiTiet).get());
        return "Ok";

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
            Integer phongCach,
            Integer idHoaDon
    ) {
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
            // Điều kiện lọc theo danh mục, màu sắc, chất liệu, kích cỡ, kiểu dáng, thương hiệu, phong cách
            if (danhMuc != null && danhMuc != 0) {
                predicates.add(criteriaBuilder.equal(root.get("danhMuc").get("id"), danhMuc));
            }
            if (mauSac != null && mauSac != 0) {
                predicates.add(criteriaBuilder.equal(root.get("mauSac").get("id"), mauSac));
            }
            if (chatLieu != null && chatLieu != 0) {
                predicates.add(criteriaBuilder.equal(root.get("chatLieu").get("id"), chatLieu));
            }
            if (kichCo != null && kichCo != 0) {
                predicates.add(criteriaBuilder.equal(root.get("size").get("id"), kichCo));
            }
            if (kieuDang != null && kieuDang != 0) {
                predicates.add(criteriaBuilder.equal(root.get("kieuDang").get("id"), kieuDang));
            }
            if (thuongHieu != null && thuongHieu != 0) {
                predicates.add(criteriaBuilder.equal(root.get("thuongHieu").get("id"), thuongHieu));
            }
            if (phongCach != null && phongCach != 0) {
                predicates.add(criteriaBuilder.equal(root.get("phongCach").get("id"), phongCach));
            }
            predicates.add(criteriaBuilder.equal(root.get("trangThai"), "Hoạt động"));
            predicates.add(criteriaBuilder.equal(root.get("sanPham").get("trangThai"), "Hoạt động"));

            query.orderBy(criteriaBuilder.desc(root.get("ngayTao")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
        return listSanPham.stream().map(spct -> convertSanPhamHienThiTrongThemBanHangTaiQuayToDTO(hoaDonRepository.findById(idHoaDon).get(), spct)).collect(Collectors.toList());
    }


    //Chuyển đổi sang object có những thông tin bên Hóa Đơn Chi Tiết
    public BanHangTaiQuayResponseDTO.SanPhamHienThiTrongThemBanHangTaiQuay convertSanPhamHienThiTrongThemBanHangTaiQuayToDTO(HoaDon hoaDon, SanPhamChiTiet sanPhamChiTiet) {
        //Viết thêm tính lại trừ với số lượng sản phẩm trong giỏ hàng theo khách hàng nếu có khách hàng
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
                Math.max(0, sanPhamChiTiet.getSoLuong() - hoaDonChiTietRepository.getTongSoluongSanPhamTheoHoaDonVaSPCTVaTrangThai(hoaDon, sanPhamChiTiet, "Hoạt động")),
                sanPhamChiTiet.getTrangThai()
        );
    }


    //Lấy list toàn bộ lọc sản phẩm
    public BanHangTaiQuayResponseDTO.LuuListCacBoLocThemSanPham getToanBoListBoLoc() {
        return new BanHangTaiQuayResponseDTO.LuuListCacBoLocThemSanPham(danhMucRepositoryP.findAll(), mauSacRepositoryP.findAll(), chatLieuRepositoryP.findAll(), sizeRepositoryP.findAll(), kieuDangRepositoryP.findAll(), thuongHieuRepositoryP.findAll(), phongCachRepositoryP.findAll());
    }

    public List<HoaDonChiTietResponseDTO.SoLuongGocVaConLaiCuaSPCTTrongHDCT> getListDanhSachSoLuongSanPhamCapNhatTruVoiSoLuongSanPhamGioHang(Integer idHoaDon) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).get();
        List<HoaDonChiTietResponseDTO.DanhSachSanPhamDTO> listDanhSachSanPham = hoaDonChiTietRepository.getHoaDonChiTietByHoaDonAndTrangThaiOrderByNgayTaoDesc(hoaDon, "Hoạt động").stream()
                .sorted(Comparator.comparing(
                        HoaDonChiTiet::getNgayTao,
                        Comparator.nullsLast(Comparator.reverseOrder()) // Đưa null xuống cuối danh sách
                ))
                .map(hdct -> new HoaDonChiTietResponseDTO.DanhSachSanPhamDTO(hdct.getId(), listURLAnhSanPhamChiTiet(hdct.getSanPhamChiTiet().getListAnh()), hdct.getSanPhamChiTiet().getSanPham().getTenSanPham() + hdct.getSanPhamChiTiet().getMauSac().getTenMauSac() + " size " + hdct.getSanPhamChiTiet().getSize().getTenSize(), hdct.getSanPhamChiTiet().getId(), hdct.getSanPhamChiTiet().getMa(), hdct.getDonGia(), hdct.getSoLuong(), hdct.getDonGia() * hdct.getSoLuong(), hdct.getTrangThai()))
                .collect(Collectors.toList());
        List<HoaDonChiTietResponseDTO.SoLuongGocVaConLaiCuaSPCTTrongHDCT> listTraVe = new ArrayList<>();
        for (HoaDonChiTietResponseDTO.DanhSachSanPhamDTO sanPham : listDanhSachSanPham
        ) {
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(sanPham.getIdSanPhamChiTiet()).get();
            Integer soLuongTrongGioHangCuaSPCT = hoaDonChiTietRepository.getTongSoluongSanPhamTheoHoaDonVaSPCTVaTrangThai(hoaDon, sanPhamChiTiet, "Hoạt động");
            HoaDonChiTietResponseDTO.SoLuongGocVaConLaiCuaSPCTTrongHDCT capNhatSoLuongSPCTTrongHDCT = new HoaDonChiTietResponseDTO.SoLuongGocVaConLaiCuaSPCTTrongHDCT(
                    sanPhamChiTiet.getSoLuong(),
                    sanPhamChiTiet.getSoLuong() - soLuongTrongGioHangCuaSPCT
            );
            listTraVe.add(capNhatSoLuongSPCTTrongHDCT);
        }
        return listTraVe;
    }

    //Lấy object HoaDonChiTiet đã chuyển đổi thông tin theo id hóa đơn
    public HoaDonChiTietResponseDTO.HoaDonChiTietDTO getHoaDonByIdClient(Integer id) {
        return convertHoaDonChiTietToDTOClient(hoaDonRepository.findById(id).get());
    }

    //Chuyển đổi sang object có những thông tin bên Hóa Đơn Chi Tiết
    public HoaDonChiTietResponseDTO.HoaDonChiTietDTO convertHoaDonChiTietToDTOClient(HoaDon hoaDon) {
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
}
