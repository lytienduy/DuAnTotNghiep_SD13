package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.SanPhamChiTietDTO;
import com.example.shopdragonbee.dto.SanPhamChiTietUpdateDTO;
import com.example.shopdragonbee.dto.UpdateSanphamChiTietDTO;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
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

        // Lưu trạng thái ban đầu của sản phẩm chi tiết
        String initialStatus = sanPhamChiTiet.getTrangThai();

        // Lấy trạng thái của sản phẩm cha (sản phẩm chính)
        String trangThaiSanPham = sanPhamChiTiet.getSanPham().getTrangThai();

        // Cập nhật số lượng
        sanPhamChiTiet.setSoLuong(request.getSoLuong());

        // Kiểm tra và cập nhật trạng thái của sản phẩm chi tiết
        if (request.getSoLuong() == 0) {
            sanPhamChiTiet.setTrangThai("Hết hàng");
        } else {
            // Nếu số lượng > 0, trạng thái sẽ quay lại trạng thái của sản phẩm cha hoặc giữ trạng thái ban đầu
            if ("Ngừng bán".equals(initialStatus)) {
                sanPhamChiTiet.setTrangThai("Ngừng bán");
            } else {
                sanPhamChiTiet.setTrangThai(trangThaiSanPham); // Trạng thái của sản phẩm cha
            }
        }

        // Cập nhật mô tả và giá
        sanPhamChiTiet.setGia(request.getGia());
        sanPhamChiTiet.setMoTa(request.getMoTa());

        // Lưu thay đổi vào database
        sanPhamChiTietRepository.save(sanPhamChiTiet);

        return convertToDTO(sanPhamChiTiet);
    }






    // add
    // Cập nhật phương thức để thêm ảnh
    public SanPhamChiTiet addSanPhamChiTiet(SanPhamChiTiet newSanPhamChiTiet) {
        // Tạo mã sản phẩm (ma)
        String newMa = generateProductCode();
        newSanPhamChiTiet.setMa(newMa);

        // Đặt trạng thái dựa trên số lượng
        if (newSanPhamChiTiet.getSoLuong() == 0) {
            newSanPhamChiTiet.getSanPham().setTrangThai("Hết hàng");
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

    // tìm kiếm
    public List<SanPhamChiTiet> searchSanPhamChiTietByTen(String ten) {
        return sanPhamChiTietRepository.searchByTenSanPham(ten);
    }
    // update số lượng và giá
    // Cập nhật nhiều sản phẩm chi tiết
    public List<SanPhamChiTiet> updateSanPhamChiTietBatch(List<UpdateSanphamChiTietDTO> updateDTOList) {
        List<SanPhamChiTiet> updatedSanPhamChiTietList = new ArrayList<>();

        for (UpdateSanphamChiTietDTO updateDTO : updateDTOList) {
            // Tìm sản phẩm chi tiết dựa trên id
            SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(updateDTO.getId()).orElse(null);

            if (sanPhamChiTiet != null) {
                // Cập nhật số lượng nếu có thay đổi
                if (updateDTO.getSoLuong() != null) {
                    sanPhamChiTiet.setSoLuong(updateDTO.getSoLuong());
                }

                // Cập nhật giá nếu có thay đổi
                if (updateDTO.getGia() != null) {
                    sanPhamChiTiet.setGia(updateDTO.getGia());
                }

                // Cập nhật ngày sửa
                sanPhamChiTiet.setNgaySua(LocalDateTime.now()); // Cập nhật ngày sửa
                sanPhamChiTiet.setNguoiSua("Tên Người Sửa"); // Thay thế "Tên Người Sửa" bằng người sửa thực tế (nếu có cơ chế xác thực)

                // Lưu lại sản phẩm chi tiết đã cập nhật
                SanPhamChiTiet updatedSanPhamChiTiet = sanPhamChiTietRepository.save(sanPhamChiTiet);
                updatedSanPhamChiTietList.add(updatedSanPhamChiTiet);
            }
        }

        return updatedSanPhamChiTietList;
    }
}
