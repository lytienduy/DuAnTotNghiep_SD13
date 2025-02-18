package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.SanPhamDTO;
import com.example.shopdragonbee.dto.SanPhamChiTietDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.*;
import com.example.shopdragonbee.respone.SanPhamChiTietRespone;
import com.example.shopdragonbee.respone.SanPhamRespone;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SanPhamService {

    private final SanPhamRepository sanPhamRepository;
    private final SanPhamChiTietRepository sanPhamChiTietRepository;
    private final DanhMucRepository danhMucRepository;
    private final ThuongHieuRepository thuongHieuRepository;
    private final PhongCachRepository phongCachRepository;
    private final XuatSuRepository xuatXuRepository;
    private final ChatLieuRepository chatLieuRepository;
    private final KieuDangRepository kieuDangRepository;
    private final KieuDaiQuanRepository kieuDaiQuanRepository;
    private final MauSacRepository mauSacRepository;
    private final SizeRepository sizeRepository;

    public List<SanPhamRespone> getAllSanPham() {
        return sanPhamRepository.getAll();
    }

    // API lấy tất cả sản phẩm (có phân trang)
    public Page<SanPhamRespone> getAllSanPhamPaged(Pageable pageable) {
        return sanPhamRepository.getAllPaged(pageable);
    }
    public SanPham getSanPhamById(Integer id) {
        return sanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
    }
    // Lấy chi tiết sản phẩm theo ID và phân trang
    public Page<SanPhamChiTietRespone> getChiTietSanPhamPaged(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return sanPhamChiTietRepository.getChiTietPaged(pageable);
    }

    // Lấy chi tiết sản phẩm theo ID mà không phân trang
    public List<SanPhamChiTietRespone> getChiTietSanPhamById(Integer id) {
        return sanPhamChiTietRepository.findBySanPhamId(id);
    }

    public Page<SanPhamRespone> searchSanPham(String tenSanPham, String trangThai, Pageable pageable) {
        return sanPhamRepository.searchSanPham(tenSanPham, trangThai, pageable);
    }

    public String toggleProductStatus(Integer id) {
        Optional<SanPham> optionalSanPham = sanPhamRepository.findById(id);
        if (optionalSanPham.isPresent()) {
            SanPham sanPham = optionalSanPham.get();
            String oldStatus = sanPham.getTrangThai();
            String newStatus = oldStatus.equals("Đang bán") ? "Ngừng bán" : "Đang bán"; // Chuyển đổi giữa "Đang bán" và "Ngừng bán"

            sanPham.setTrangThai(newStatus); // Cập nhật trạng thái
            sanPhamRepository.save(sanPham); // Lưu vào database

            return "Trạng thái đã chuyển từ " + oldStatus + " -> " + newStatus;
        }
        return "Không tìm thấy sản phẩm với ID: " + id;
    }
    public SanPhamChiTiet updateSanPhamChiTiet(Integer id, SanPhamChiTietDTO sanPhamChiTietDTO) {
        Optional<SanPhamChiTiet> optionalSanPhamChiTiet = sanPhamChiTietRepository.findById(id);

        if (optionalSanPhamChiTiet.isPresent()) {
            SanPhamChiTiet existingProductDetail = optionalSanPhamChiTiet.get();

            // Cập nhật thông tin cơ bản
            existingProductDetail.setMa(sanPhamChiTietDTO.getMa());
            existingProductDetail.setSoLuong(sanPhamChiTietDTO.getSoLuong());
            existingProductDetail.setMoTa(sanPhamChiTietDTO.getMoTa());
            existingProductDetail.setTrangThai(sanPhamChiTietDTO.getTrangThai());
            existingProductDetail.setGia(sanPhamChiTietDTO.getGia());
            existingProductDetail.setNgaySua(LocalDateTime.now());

            // Cập nhật thuộc tính ManyToOne
            if (sanPhamChiTietDTO.getSanPham() != null) {
                Optional<SanPham> sanPham = sanPhamRepository.findById(Integer.parseInt(sanPhamChiTietDTO.getSanPham()));
                sanPham.ifPresent(existingProductDetail::setSanPham);
            }
            if (sanPhamChiTietDTO.getMauSac() != null) {
                Optional<MauSac> mauSac = mauSacRepository.findById(Integer.parseInt(sanPhamChiTietDTO.getMauSac()));
                mauSac.ifPresent(existingProductDetail::setMauSac);
            }
            if (sanPhamChiTietDTO.getChatLieu() != null) {
                Optional<ChatLieu> chatLieu = chatLieuRepository.findById(Integer.parseInt(sanPhamChiTietDTO.getChatLieu()));
                chatLieu.ifPresent(existingProductDetail::setChatLieu);
            }
            if (sanPhamChiTietDTO.getDanhMuc() != null) {
                Optional<DanhMuc> danhMuc = danhMucRepository.findById(Integer.parseInt(sanPhamChiTietDTO.getDanhMuc()));
                danhMuc.ifPresent(existingProductDetail::setDanhMuc);
            }
            if (sanPhamChiTietDTO.getSize() != null) {
                Optional<Size> size = sizeRepository.findById(Integer.parseInt(sanPhamChiTietDTO.getSize()));
                size.ifPresent(existingProductDetail::setSize);
            }
            if (sanPhamChiTietDTO.getThuongHieu() != null) {
                Optional<ThuongHieu> thuongHieu = thuongHieuRepository.findById(Integer.parseInt(sanPhamChiTietDTO.getThuongHieu()));
                thuongHieu.ifPresent(existingProductDetail::setThuongHieu);
            }
            if (sanPhamChiTietDTO.getKieuDang() != null) {
                Optional<KieuDang> kieuDang = kieuDangRepository.findById(Integer.parseInt(sanPhamChiTietDTO.getKieuDang()));
                kieuDang.ifPresent(existingProductDetail::setKieuDang);
            }
            if (sanPhamChiTietDTO.getKieuDaiQuan() != null) {
                Optional<KieuDaiQuan> kieuDaiQuan = kieuDaiQuanRepository.findById(Integer.parseInt(sanPhamChiTietDTO.getKieuDaiQuan()));
                kieuDaiQuan.ifPresent(existingProductDetail::setKieuDaiQuan);
            }
            if (sanPhamChiTietDTO.getXuatXu() != null) {
                Optional<XuatXu> xuatXu = xuatXuRepository.findById(Integer.parseInt(sanPhamChiTietDTO.getXuatXu()));
                xuatXu.ifPresent(existingProductDetail::setXuatXu);
            }
            if (sanPhamChiTietDTO.getPhongCach() != null) {
                Optional<PhongCach> phongCach = phongCachRepository.findById(Integer.parseInt(sanPhamChiTietDTO.getPhongCach()));
                phongCach.ifPresent(existingProductDetail::setPhongCach);
            }

            // Lưu lại sản phẩm chi tiết đã được cập nhật
            return sanPhamChiTietRepository.save(existingProductDetail);
        }

        return null; // Trả về null nếu không tìm thấy sản phẩm chi tiết
    }
    // add sản phẩm
    public SanPham addSanPham(SanPham sanPham) throws Exception {
        // Kiểm tra trùng tên sản phẩm
        Optional<SanPham> existingProduct = sanPhamRepository.findByTenSanPham(sanPham.getTenSanPham());
        if (existingProduct.isPresent()) {
            throw new Exception("Tên sản phẩm đã tồn tại");
        }

        // Tạo mã sản phẩm mới
        String newCode = generateNewProductCode();
        sanPham.setMa(newCode);

        // Thiết lập ngày tạo và trạng thái mặc định
        sanPham.setNgayTao(LocalDateTime.now());
        sanPham.setTrangThai("Đang bán");

        return sanPhamRepository.save(sanPham);
    }

    private String generateNewProductCode() {
        String lastCode = sanPhamRepository.findLastMaSanPham();

        int newNumber = 1; // Mặc định nếu chưa có mã nào
        if (lastCode != null && lastCode.startsWith("SP")) {
            try {
                newNumber = Integer.parseInt(lastCode.substring(2)) + 1;
            } catch (NumberFormatException e) {
                throw new RuntimeException("Lỗi khi chuyển đổi mã sản phẩm: " + lastCode);
            }
        }

        return String.format("SP%03d", newNumber);
    }




}
