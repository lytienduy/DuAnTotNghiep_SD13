package com.example.shopdragonbee.service.Client;

import com.example.shopdragonbee.dto.BanHangTaiQuayResponseDTO;
import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.dto.Client.SanPhamDTO;
import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.MauSac;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.repository.*;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SanPhamClientService {
    @Autowired
    private SanPhamChiTietRepositoryP sanPhamChiTietRepositoryP;

    @Autowired
    private SanPhamRepositoryP sanPhamRepositoryP;

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

    public SanPhamDTO.SizeCuaPhong convertSangListSizeCuaPhong(SanPhamChiTiet sanPhamChiTiet) {
        return new SanPhamDTO.SizeCuaPhong(
                sanPhamChiTiet.getId(),
                sanPhamChiTiet.getSanPham().getTenSanPham() + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang() + " - " + sanPhamChiTiet.getMauSac().getTenMauSac() + " -sz" + sanPhamChiTiet.getSize().getTenSize(),
                sanPhamChiTiet.getSize().getId(),
                sanPhamChiTiet.getSize().getMa(),
                sanPhamChiTiet.getSize().getTenSize(),
                sanPhamChiTiet.getSoLuong()
        );
    }

    //Lọc list sản phẩm trong trang sản phẩm
    public List<SanPhamDTO.SanPhamClient> getListSanPhamTheoBoLoc(
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
        List<SanPhamDTO.SanPhamClient> listTraVe = new ArrayList<>();
        List<SanPhamChiTiet> listSanPhamChiTietTheoBoLoc = getListSanPhamChiTietTheoIDSanPham(searchText, fromGia, toGia, danhMuc, mauSac, chatLieu, kichCo, kieuDang, thuongHieu, phongCach);
        // Dùng LinkedHashMap để loại bỏ trùng nhưng giữ đúng thứ tự
        Map<Integer, SanPham> uniqueSanPhamMap = new LinkedHashMap<>();

        for (SanPhamChiTiet spct : listSanPhamChiTietTheoBoLoc) {
            SanPham sanPham = spct.getSanPham();
            uniqueSanPhamMap.putIfAbsent(sanPham.getId(), sanPham); // Chỉ thêm nếu chưa có
        }

        for (SanPham sanPham : new ArrayList<>(uniqueSanPhamMap.values())) {//Nhưng chỉ có một bạn ghi nên dựa vào để lấy sản phẩm
            SanPhamDTO.SanPhamClient tongQuanSanPhamCTClient = new SanPhamDTO.SanPhamClient();//Tạo ra đối tượng của listTraVe
            tongQuanSanPhamCTClient.setId(sanPham.getId());
            List<SanPhamDTO.MauSacAndHinhAnhAndSize> listMauSacAndSizeCuaSp = new ArrayList<>();//Tạo ra list để lưu những sản phẩm màu sắc, hình ảnh và size của sản phẩm
            List<MauSac> listMauSac = sanPhamChiTietRepositoryP.getMauSacTheoIDSanPhamAndTrangThai(sanPham.getId(), "Hoạt động");//Lấy những sản phẩm chi tiết phân biệt theo màu sắc
            int index = 0;
            for (MauSac ms : listMauSac//Chạy foreach lấy list size theo màu
            ) {
                SanPhamDTO.MauSacAndHinhAnhAndSize mauSacAndHinhAnhAndSize = new SanPhamDTO.MauSacAndHinhAnhAndSize();
                mauSacAndHinhAnhAndSize.setMauSac(ms);
                List<SanPhamChiTiet> listSPCT = sanPhamChiTietRepositoryP.findBySanPhamAndMauSacAndTrangThai(sanPham, ms, "Hoạt động");
                for (SanPhamChiTiet sanPhamChiTiet : listSPCT
                ) {
                    if (index == 0) {
                        tongQuanSanPhamCTClient.setTen(sanPham.getTenSanPham() + " " + sanPhamChiTiet.getChatLieu().getTenChatLieu() + " " + sanPhamChiTiet.getThuongHieu().getTenThuongHieu() + " " + sanPhamChiTiet.getDanhMuc().getTenDanhMuc() + " " + sanPhamChiTiet.getKieuDang().getTenKieuDang());
                        tongQuanSanPhamCTClient.setGia(sanPhamChiTiet.getGia());
                    }
                    if (sanPhamChiTiet.getListAnh().isEmpty() == false) {
                        mauSacAndHinhAnhAndSize.setListAnh(listURLAnhSanPham(sanPhamChiTiet.getListAnh()));
                        break;
                    }
                    ++index;
                }
                mauSacAndHinhAnhAndSize.setListSize(listSPCT.stream().map(this::convertSangListSizeCuaPhong).collect(Collectors.toList()));
                listMauSacAndSizeCuaSp.add(mauSacAndHinhAnhAndSize);
            }
            tongQuanSanPhamCTClient.setListHinhAnhAndMauSacAndSize(listMauSacAndSizeCuaSp);
            listTraVe.add(tongQuanSanPhamCTClient);
        }
        return listTraVe;
    }

    //Chuyển đổi sang object có những thông tin bên Hóa Đơn Chi Tiết
    public SanPham convertSPCTToSPDTO(SanPhamChiTiet sanPhamChiTiet) {
        return sanPhamChiTiet.getSanPham();
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
            Integer phongCach
    ) {
        List<SanPhamChiTiet> listSanPhamChiTiet = sanPhamChiTietRepositoryP.findAll((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

//            predicates.add(criteriaBuilder.equal(root.get("sanPham").get("id"), idSanPham));

            predicates.add(criteriaBuilder.equal(root.get("trangThai"), "Hoạt động"));

            predicates.add(criteriaBuilder.equal(root.get("sanPham").get("trangThai"), "Hoạt động"));

            if (searchText != null && !searchText.trim().isEmpty()) {
                String searchLower = searchText.toLowerCase().trim();

                // Kiểm tra nếu searchText có thể là mã sản phẩm (ví dụ: 10001, QANAM32)
                Predicate byMa = criteriaBuilder.like(criteriaBuilder.lower(root.get("sanPham").get("ma")), "%" + searchLower + "%");

                // Tạo chuỗi chứa thông tin tìm kiếm (tất cả viết thường)
                Expression<String> tenSanPhamChiTiet = criteriaBuilder.lower(
                        criteriaBuilder.concat(
                                criteriaBuilder.concat(
                                        criteriaBuilder.concat(
                                                criteriaBuilder.concat(
                                                        root.get("sanPham").get("tenSanPham"),
                                                        criteriaBuilder.literal(" ")
                                                ),
                                                root.get("danhMuc").get("tenDanhMuc")
                                        ),
                                        criteriaBuilder.literal(" ")
                                ),
                                criteriaBuilder.concat(
                                        criteriaBuilder.concat(
                                                root.get("kieuDang").get("tenKieuDang"),
                                                criteriaBuilder.literal(" ")
                                        ),
                                        root.get("thuongHieu").get("tenThuongHieu")
                                )
                        )
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
            if (fromGia != null && toGia != null) {
                Predicate datePredicate = criteriaBuilder.between(
                        root.get("gia"), fromGia, toGia
                );
                predicates.add(datePredicate);
            }
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
//        List<SanPham> uniqueSanPhams = listSanPham.stream()
//                .map(SanPhamChiTiet::getSanPham)
//                .distinct() // Lọc trùng
//                .collect(Collectors.toList());

//        return listSanPham.stream().map(this::convertSPCTToSPDTO).collect(Collectors.toList());//Convert spct để lấy về sp thôi
        return listSanPhamChiTiet;
    }


}
