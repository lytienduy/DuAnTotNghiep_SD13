package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.SanPhamChiTietDTO;
import com.example.shopdragonbee.dto.SanPhamChiTietUpdateDTO;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
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
        sanPhamChiTiet.setTrangThai(request.getSoLuong() > 0 ? "Còn hàng" : "Hết hàng");
        sanPhamChiTiet.setMoTa(request.getMoTa());
        sanPhamChiTiet.setGia(request.getGia());

        // Lưu thay đổi vào database
        sanPhamChiTietRepository.save(sanPhamChiTiet);

        // Trả về DTO đã cập nhật
        return convertToDTO(sanPhamChiTiet);
    }

// tìm kiếm và bộ lọc


}
