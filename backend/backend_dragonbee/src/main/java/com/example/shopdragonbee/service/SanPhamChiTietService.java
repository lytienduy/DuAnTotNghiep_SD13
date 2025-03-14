package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.SanPhamChiTietDTO;
import com.example.shopdragonbee.dto.SanPhamChiTietUpdateDTO;
import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.ChatLieu;
import com.example.shopdragonbee.entity.DanhMuc;
import com.example.shopdragonbee.entity.KieuDaiQuan;
import com.example.shopdragonbee.entity.KieuDang;
import com.example.shopdragonbee.entity.MauSac;
import com.example.shopdragonbee.entity.PhongCach;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.entity.Size;
import com.example.shopdragonbee.entity.ThuongHieu;
import com.example.shopdragonbee.entity.XuatXu;
import com.example.shopdragonbee.repository.AnhSanPhamRepository;
import com.example.shopdragonbee.repository.ChatLieuRepository;
import com.example.shopdragonbee.repository.DanhMucRepository;
import com.example.shopdragonbee.repository.KieuDaiQuanRepository;
import com.example.shopdragonbee.repository.KieuDangRepository;
import com.example.shopdragonbee.repository.MauSacRepository;
import com.example.shopdragonbee.repository.PhongCachRepository;
import com.example.shopdragonbee.repository.SanPhamChiTietRepository;
import com.example.shopdragonbee.repository.SizeRepository;
import com.example.shopdragonbee.repository.ThuongHieuRepository;
import com.example.shopdragonbee.repository.XuatXuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SanPhamChiTietService {

    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;
    @Autowired
    private DanhMucRepository danhMucRepository;
    @Autowired
    private ThuongHieuRepository thuongHieuRepository;
    @Autowired
    private PhongCachRepository phongCachRepository;
    @Autowired
    private ChatLieuRepository chatLieuRepository;
    @Autowired
    private KieuDangRepository kieuDangRepository;
    @Autowired
    private KieuDaiQuanRepository kieuDaiQuanRepository;
    @Autowired
    private XuatXuRepository xuatXuRepository;
    @Autowired
    private MauSacRepository mauSacRepository;
    @Autowired
    private SizeRepository sizeRepository;
    @Autowired
    private AnhSanPhamRepository anhSanPhamRepository;
    @Autowired
    private SanPhamService sanPhamService;

    public SanPhamChiTietDTO getSanPhamChiTietById(Integer id) {
        SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(id).orElseThrow();
        return convertToDTO(sanPhamChiTiet);
    }

    private SanPhamChiTietDTO convertToDTO(SanPhamChiTiet sanPhamChiTiet) {
        return SanPhamChiTietDTO.builder()
                .id(sanPhamChiTiet.getId())
                .ma(sanPhamChiTiet.getMa())
                .sanPhamId(sanPhamChiTiet.getSanPham().getId()) // Nếu có mối quan hệ @ManyToOne
                .danhMucId(sanPhamChiTiet.getDanhMuc().getId())
                .thuongHieuId(sanPhamChiTiet.getThuongHieu().getId())
                .phongCachId(sanPhamChiTiet.getPhongCach().getId())
                .chatLieuId(sanPhamChiTiet.getChatLieu().getId())
                .mauSacId(sanPhamChiTiet.getMauSac().getId())
                .sizeId(sanPhamChiTiet.getSize().getId())
                .kieuDangId(sanPhamChiTiet.getKieuDang().getId())
                .kieuDaiQuanId(sanPhamChiTiet.getKieuDaiQuan().getId())
                .xuatXuId(sanPhamChiTiet.getXuatXu().getId())
                .soLuong(sanPhamChiTiet.getSoLuong())
                .gia(sanPhamChiTiet.getGia())
                .trangThai(sanPhamChiTiet.getTrangThai())
                .moTa(sanPhamChiTiet.getMoTa())

                .build();
    }

    // update 1 sản phẩm chi tiết
    @Transactional
    public SanPhamChiTietDTO updateSanPhamChiTiet(Integer id, SanPhamChiTietUpdateDTO request) {
        SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm chi tiết không tồn tại"));

        // Cập nhật danh mục, thương hiệu, phong cách, chất liệu, kiểu dáng, màu sắc, size, xuất xứ
        sanPhamChiTiet.setDanhMuc(danhMucRepository.findById(request.getDanhMucId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại")));

        sanPhamChiTiet.setThuongHieu(thuongHieuRepository.findById(request.getThuongHieuId())
                .orElseThrow(() -> new RuntimeException("Thương hiệu không tồn tại")));

        sanPhamChiTiet.setPhongCach(phongCachRepository.findById(request.getPhongCachId())
                .orElseThrow(() -> new RuntimeException("Phong cách không tồn tại")));

        sanPhamChiTiet.setChatLieu(chatLieuRepository.findById(request.getChatLieuId())
                .orElseThrow(() -> new RuntimeException("Chất liệu không tồn tại")));

        sanPhamChiTiet.setKieuDang(kieuDangRepository.findById(request.getKieuDangId())
                .orElseThrow(() -> new RuntimeException("Kiểu dáng không tồn tại")));

        sanPhamChiTiet.setKieuDaiQuan(kieuDaiQuanRepository.findById(request.getKieuDaiQuanId())
                .orElseThrow(() -> new RuntimeException("Kiểu đai quần không tồn tại")));

        sanPhamChiTiet.setXuatXu(xuatXuRepository.findById(request.getXuatXuId())
                .orElseThrow(() -> new RuntimeException("Xuất xứ không tồn tại")));

        sanPhamChiTiet.setMauSac(mauSacRepository.findById(request.getMauSacId())
                .orElseThrow(() -> new RuntimeException("Màu sắc không tồn tại")));

        sanPhamChiTiet.setSize(sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new RuntimeException("Size không tồn tại")));

        // Cập nhật các trường khác
        sanPhamChiTiet.setSoLuong(request.getSoLuong());
        sanPhamChiTiet.setTrangThai(request.getSoLuong() > 0 ? "Hoạt động" : "Hết hàng");
        sanPhamChiTiet.setMoTa(request.getMoTa());
        sanPhamChiTiet.setGia(request.getGia());

        // Lưu thay đổi vào database
        sanPhamChiTietRepository.save(sanPhamChiTiet);

        // Trả về DTO đã cập nhật
        return convertToDTO(sanPhamChiTiet);
    }

// tìm kiếm và bộ lọc
//    public List<SanPhamChiTietDTO> searchSanPham(String tenSanPham, Integer danhMucId, Integer thuongHieuId, Integer
//        phongCachId, Integer chatLieuId, Integer kieuDangId, Integer kieuDaiQuanId,
//                                             Integer xuatXuId, Integer mauSacId, Integer sizeId, Double giaMin,
//                                             Double giaMax) {
//    List<SanPhamChiTiet> sanPhams = sanPhamChiTietRepository.searchSanPham(tenSanPham, danhMucId,
//            thuongHieuId, phongCachId, chatLieuId, kieuDangId, kieuDaiQuanId, xuatXuId, mauSacId,
//            sizeId, giaMin, giaMax);
//    return sanPhams.stream().map(sp -> new SanPhamChiTietDTO(
//            sp.getId(),
//            sp.getMa(),
//            sp.getSanPham().getId(),
//            sp.getDanhMuc().getId(),
//            sp.getThuongHieu().getId(),
//            sp.getPhongCach().getId(),
//            sp.getChatLieu().getId(),
//            sp.getMauSac().getId(),
//            sp.getSize().getId(),
//            sp.getKieuDang().getId(),
//            sp.getKieuDaiQuan().getId(),
//            sp.getXuatXu().getId(),
//            sp.getSoLuong(),
//            sp.getGia(),
//            sp.getTrangThai(),
//            sp.getMoTa()
//    )).collect(Collectors.toList());
//}


    // add
    // Cập nhật phương thức để thêm ảnh
    public SanPhamChiTiet addSanPhamChiTiet(SanPhamChiTiet newSanPhamChiTiet) {
        // Tạo mã sản phẩm (ma)
        String newMa = generateProductCode();
        newSanPhamChiTiet.setMa(newMa);

        // Đặt trạng thái dựa trên số lượng
        if (newSanPhamChiTiet.getSoLuong() > 0) {
            newSanPhamChiTiet.setTrangThai("Hoạt động");
        } else {
            newSanPhamChiTiet.setTrangThai("Hết hàng");
        }

        // Thiết lập thông tin ngày tạo và người tạo
        newSanPhamChiTiet.setNgayTao(LocalDateTime.now());
        newSanPhamChiTiet.setNguoiTao("Admin"); // Hoặc lấy thông tin người dùng hiện tại

        // Lưu sản phẩm chi tiết vào DB
        SanPhamChiTiet savedSanPhamChiTiet = sanPhamChiTietRepository.save(newSanPhamChiTiet);

        return savedSanPhamChiTiet; // Trả về sản phẩm chi tiết đã được lưu
    }

    // Hàm tạo mã sản phẩm chi tiết
    public String generateProductCode() {
        Integer maxId = sanPhamChiTietRepository.getMaxId();
        if (maxId == null || maxId < 0) {
            maxId = 0;
        }
        return "SPCT" + (maxId + 1);  // Tạo mã sản phẩm chi tiết
    }

    // Hàm tạo mã ảnh
    public String generateImageCode() {
        Integer maxId = anhSanPhamRepository.getMaxId();
        if (maxId == null || maxId < 0) {
            maxId = 0;
        }
        return "IMG" + (maxId + 1);  // Tạo mã ảnh
    }
}
