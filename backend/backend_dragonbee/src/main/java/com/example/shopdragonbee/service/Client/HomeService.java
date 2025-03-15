package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.BanHangTaiQuayResponseDTO;
import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.*;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class HomeService {
    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;

    @Autowired
    private SanPhamRepositoryP sanPhamRepositoryP;
    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

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

    //Chuyển đổi lấy list url hình ảnh theo listAnhSanPham
    public List<String> listURLAnhSanPham(List<AnhSanPham> list) {
        List<String> listUrl = new ArrayList<>();
        for (AnhSanPham anh : list
        ) {
            listUrl.add(anh.getAnhUrl());
        }
        return listUrl;
    }

    //Lấy list màu của sản phẩm
    public List<String> listMauTheoSanPham() {
        List<String> listUrl = new ArrayList<>();
        for (AnhSanPham anh : list
        ) {
            listUrl.add(anh.getAnhUrl());
        }
        return listUrl;
    }

    //Chuyển đổi sang object có những thông tin bên Hóa Đơn Chi Tiết
    public HomeDTO.SanPhamHienThiTrangHomeClient convertSanPhamHienThiTrangHomeClient(SanPham sanPham) {
        SanPhamChiTiet spct = sanPhamChiTietRepositoryP.findTopBySanPhamOrderByNgayTaoDesc(sanPham);
        return new HomeDTO.SanPhamHienThiTrangHomeClient(
                sanPham.getId(),
                sanPham.getMa(),
                sanPham.getTenSanPham() + spct.getDanhMuc().getTenDanhMuc() + " " + spct.getKieuDang().getTenKieuDang() + " " + sanPham.getMa(),
                listURLAnhSanPham(spct != null ? spct.getListAnh() : Collections.emptyList()),
                spct.getGia()
        );
    }

    //Chuyển đổi sang object có những thông tin bên Hóa Đơn Chi Tiết
    public HomeDTO.SanPhamHienThiTrangHomeClient convertSanPhamHienThiTrangSanPhamClient(SanPham sanPham) {
        SanPhamChiTiet spct = .findTopBySanPhamOrderByNgayTaoDesc(sanPham);
        return new HomeDTO.SanPhamHienThiTrangSanPhamClient(
                sanPham.getId(),
                sanPham.getMa(),
                sanPham.getTenSanPham() + spct.getDanhMuc().getTenDanhMuc() + " " + spct.getKieuDang().getTenKieuDang() + " " + sanPham.getMa(),
                listURLAnhSanPham(spct != null ? spct.getListAnh() : Collections.emptyList()),
                listURLAnhSanPham(spct != null ? spct.getListAnh() : Collections.emptyList()),
                spct.getGia()
        );
    }

    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListSanPhamQuanAuNamDanhMucBusiness() {
        List<SanPham> listSP = sanPhamChiTietRepositoryP.getListSanPhamTheoTenDanhMucVaDangHoatDong("Business");
        return listSP.stream().map(this::convertSanPhamHienThiTrangHomeClient).collect(Collectors.toList());
    }

    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListSanPhamQuanAuNamDanhMucGolf() {
        List<SanPham> listSP = sanPhamChiTietRepositoryP.getListSanPhamTheoTenDanhMucVaDangHoatDong("Golf");
        return listSP.stream().map(this::convertSanPhamHienThiTrangHomeClient).collect(Collectors.toList());
    }

    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListSanPhamQuanAuNamDanhMucCasual() {
        List<SanPham> listSP = sanPhamChiTietRepositoryP.getListSanPhamTheoTenDanhMucVaDangHoatDong("Casual");
        return listSP.stream().map(this::convertSanPhamHienThiTrangHomeClient).collect(Collectors.toList());
    }

    public List<HomeDTO.SanPhamHienThiTrangHomeClient> getListTopSanPhamBanChay() {
        Pageable pageable = PageRequest.of(0, 6);
        List<SanPham> listSP = hoaDonChiTietRepository.findTopSanPhamChiTietBanChay(pageable);
        return listSP.stream().map(this::convertSanPhamHienThiTrangHomeClient).collect(Collectors.toList());
    }

    //Lấy list toàn bộ lọc sản phẩm
    public BanHangTaiQuayResponseDTO.LuuListCacBoLocThemSanPham getToanBoListBoLoc() {
        return new BanHangTaiQuayResponseDTO.LuuListCacBoLocThemSanPham(
                danhMucRepositoryP.findAll(),
                mauSacRepositoryP.findAll(),
                chatLieuRepositoryP.findAll(),
                sizeRepositoryP.findAll(),
                kieuDangRepositoryP.findAll(),
                thuongHieuRepositoryP.findAll(),
                phongCachRepositoryP.findAll());
    }

    //Lọc list sản phẩm trong trang sản phẩm
    public List<HomeDTO.SanPhamHienThiTrangSanPhamClient> getListSanPhamTheoBoLoc(
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
        List<HomeDTO.SanPhamHienThiTrangSanPhamClient> listSanPham = new ArrayList<>();
        for (SanPham sp : sanPhamRepositoryP.findByTrangThai("Hoạt động")) {
            List<SanPhamChiTiet> listSanPhamChiTietTheoBoLoc = getListSanPhamChiTietTheoIDSanPham(searchText, fromGia, toGia, danhMuc, mauSac, chatLieu, kichCo, kieuDang, thuongHieu, phongCach, sp.getId());
            SanPhamChiTiet spct = listSanPhamChiTietTheoBoLoc.get(0);
            if (listSanPhamChiTietTheoBoLoc.isEmpty() == false) {
                listSanPham.add(new HomeDTO.SanPhamHienThiTrangSanPhamClient(
                        sp.getId(), sp.getMa(),
                        sp.getTenSanPham() + spct.getDanhMuc().getTenDanhMuc() + " " + spct.getKieuDang().getTenKieuDang() + " " + sp.getMa(),
                        listURLAnhSanPham(listSanPhamChiTietTheoBoLoc.get(0).getListAnh()),
                        listSanPhamChiTietTheoBoLoc, spct.getGia()));
            }
        }
    }

    //Lấy các sản phẩm
    public List<SanPhamChiTiet> getListSanPhamChiTietTheoIDSanPham(
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
            Integer idSanPham) {
        List<SanPhamChiTiet> listSanPham = sanPhamChiTietRepositoryP.findAll((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("sanPham").get("id"), idSanPham));

            predicates.add(criteriaBuilder.equal(root.get("trangThai"), "Hoạt động"));

            predicates.add(criteriaBuilder.equal(root.get("sanPham").get("trangThai"), "Hoạt động"));

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
            query.orderBy(criteriaBuilder.desc(root.get("ngayTao")));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
        return listSanPham;
    }


}
