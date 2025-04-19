package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.AnhSanPhamDTO;
import com.example.shopdragonbee.dto.SanPhamChiTietDTO;
import com.example.shopdragonbee.dto.SanPhamChiTietUpdateDTO;
import com.example.shopdragonbee.dto.UpdateSanphamChiTietDTO;
import com.example.shopdragonbee.entity.AnhSanPham;
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
import com.example.shopdragonbee.specification.SanPhamChiTietSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
    public SanPhamChiTietDTO getSanPhamChiTietById(Integer id) {
        SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findByIdWithAnh(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm chi tiết với ID: " + id));
        return convertToDTO(sanPhamChiTiet);
    }


    private SanPhamChiTietDTO convertToDTO(SanPhamChiTiet entity) {
        return SanPhamChiTietDTO.builder()
                .id(entity.getId())
                .ma(entity.getMa())
                .sanPhamId(entity.getSanPham() != null ? entity.getSanPham().getId() : null)
                .danhMucId(entity.getDanhMuc() != null ? entity.getDanhMuc().getId() : null)
                .thuongHieuId(entity.getThuongHieu() != null ? entity.getThuongHieu().getId() : null)
                .phongCachId(entity.getPhongCach() != null ? entity.getPhongCach().getId() : null)
                .chatLieuId(entity.getChatLieu() != null ? entity.getChatLieu().getId() : null)
                .mauSacId(entity.getMauSac() != null ? entity.getMauSac().getId() : null)
                .sizeId(entity.getSize() != null ? entity.getSize().getId() : null)
                .kieuDangId(entity.getKieuDang() != null ? entity.getKieuDang().getId() : null)
                .kieuDaiQuanId(entity.getKieuDaiQuan() != null ? entity.getKieuDaiQuan().getId() : null)
                .xuatXuId(entity.getXuatXu() != null ? entity.getXuatXu().getId() : null)
                .soLuong(entity.getSoLuong())
                .gia(entity.getGia())
                .trangThai(entity.getTrangThai())
                .moTa(entity.getMoTa())

                // Lấy danh sách URL để hiển thị ảnh
                .anhUrls(
                        entity.getListAnh().stream()
                                .map(AnhSanPham::getAnhUrl)
                                .collect(Collectors.toList())
                )

                // Lấy danh sách ảnh đầy đủ để phục vụ xóa ảnh (URL → ID)
                .anhSanPhams(
                        entity.getListAnh().stream()
                                .map(anh -> AnhSanPhamDTO.builder()
                                        .id(anh.getId())
                                        .anhUrl(anh.getAnhUrl())
                                        .sanPhamChiTietId(entity.getId())
                                        .build())
                                .collect(Collectors.toList())
                )

                .build();
    }



    // update 1 sản phẩm chi tiết
    @Transactional
    public SanPhamChiTiet updateSanPhamChiTiet(Integer id, SanPhamChiTietUpdateDTO sanPhamChiTietUpdateDTO) {
        // Tìm sản phẩm chi tiết
        SanPhamChiTiet sanPhamChiTiet = sanPhamChiTietRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm chi tiết không tồn tại"));

        // Cập nhật các trường thông tin từ DTO
        if (sanPhamChiTietUpdateDTO.getDanhMucId() != null) {
            sanPhamChiTiet.setDanhMuc(danhMucRepository.findById(sanPhamChiTietUpdateDTO.getDanhMucId()).orElse(null));
        }
        if (sanPhamChiTietUpdateDTO.getThuongHieuId() != null) {
            sanPhamChiTiet.setThuongHieu(thuongHieuRepository.findById(sanPhamChiTietUpdateDTO.getThuongHieuId()).orElse(null));
        }
        if (sanPhamChiTietUpdateDTO.getPhongCachId() != null) {
            sanPhamChiTiet.setPhongCach(phongCachRepository.findById(sanPhamChiTietUpdateDTO.getPhongCachId()).orElse(null));
        }
        if (sanPhamChiTietUpdateDTO.getChatLieuId() != null) {
            sanPhamChiTiet.setChatLieu(chatLieuRepository.findById(sanPhamChiTietUpdateDTO.getChatLieuId()).orElse(null));
        }
        if (sanPhamChiTietUpdateDTO.getKieuDangId() != null) {
            sanPhamChiTiet.setKieuDang(kieuDangRepository.findById(sanPhamChiTietUpdateDTO.getKieuDangId()).orElse(null));
        }
        if (sanPhamChiTietUpdateDTO.getKieuDaiQuanId() != null) {
            sanPhamChiTiet.setKieuDaiQuan(kieuDaiQuanRepository.findById(sanPhamChiTietUpdateDTO.getKieuDaiQuanId()).orElse(null));
        }
        if (sanPhamChiTietUpdateDTO.getXuatXuId() != null) {
            sanPhamChiTiet.setXuatXu(xuatXuRepository.findById(sanPhamChiTietUpdateDTO.getXuatXuId()).orElse(null));
        }

        // Cập nhật các thông tin khác
        sanPhamChiTiet.setMoTa(sanPhamChiTietUpdateDTO.getMoTa());
        if (sanPhamChiTietUpdateDTO.getMauSacId() != null) {
            sanPhamChiTiet.setMauSac(mauSacRepository.findById(sanPhamChiTietUpdateDTO.getMauSacId()).orElse(null));
        }
        if (sanPhamChiTietUpdateDTO.getSizeId() != null) {
            sanPhamChiTiet.setSize(sizeRepository.findById(sanPhamChiTietUpdateDTO.getSizeId()).orElse(null));
        }

        sanPhamChiTiet.setSoLuong(sanPhamChiTietUpdateDTO.getSoLuong());
        sanPhamChiTiet.setGia(sanPhamChiTietUpdateDTO.getGia());

        // Cập nhật trạng thái sản phẩm chi tiết
        if (sanPhamChiTiet.getSoLuong() == 0) {
            sanPhamChiTiet.setTrangThai("Hết hàng");
        } else {
            // Kiểm tra nếu sanPhamChiTiet.getSanPham() không bị null
            if (sanPhamChiTiet.getSanPham() != null) {
                sanPhamChiTiet.setTrangThai(sanPhamChiTiet.getSanPham().getTrangThai());
            } else {
                sanPhamChiTiet.setTrangThai("Chưa xác định");
            }
        }

        // Cập nhật ảnh cho sản phẩm chi tiết
        updateAnhSanPham(sanPhamChiTiet, sanPhamChiTietUpdateDTO.getAnhUrlsToAdd(), sanPhamChiTietUpdateDTO.getAnhIdsToDelete());

        // Lưu sản phẩm chi tiết vào DB
        return sanPhamChiTietRepository.save(sanPhamChiTiet);
    }

    private String generateAnhMa() {
        List<String> lastAnhMas = anhSanPhamRepository.findAllByOrderByMaDesc();

        int newMa = 1;

        Optional<String> lastValidMa = lastAnhMas.stream()
                .filter(ma -> ma.startsWith("MA"))
                .findFirst();

        if (lastValidMa.isPresent()) {
            try {
                String numberPart = lastValidMa.get().substring(2); // ví dụ "001"
                newMa = Integer.parseInt(numberPart) + 1;
            } catch (NumberFormatException e) {
                // Nếu lỡ có mã MAabc → bỏ qua
                newMa = 1;
            }
        }

        return String.format("MA%03d", newMa);
    }


    private void updateAnhSanPham(SanPhamChiTiet sanPhamChiTiet, List<String> anhUrlsToAdd, List<Integer> anhIdsToDelete) {
        // Xóa các ảnh theo danh sách ID cần xóa
        if (anhIdsToDelete != null && !anhIdsToDelete.isEmpty()) {
            for (Integer anhId : anhIdsToDelete) {
                anhSanPhamRepository.findById(anhId).ifPresent(anhSanPham -> {
                    if (anhSanPham.getSanPhamChiTiet().equals(sanPhamChiTiet)) {
                        anhSanPhamRepository.delete(anhSanPham);
                    }
                });
            }
        }

        // Thêm các ảnh mới vào sản phẩm chi tiết
        if (anhUrlsToAdd != null && !anhUrlsToAdd.isEmpty()) {
            for (String anhUrl : anhUrlsToAdd) {
                AnhSanPham anhSanPham = new AnhSanPham();
                anhSanPham.setAnhUrl(anhUrl);
                anhSanPham.setSanPhamChiTiet(sanPhamChiTiet);

                // Sinh mã ảnh tự động theo định dạng "MA001", "MA002", v.v.
                String maAnh = generateAnhMa();
                anhSanPham.setMa(maAnh);  // Gán giá trị cho trường ma

                anhSanPhamRepository.save(anhSanPham);
            }
        }
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
        }else {
            newSanPhamChiTiet.getSanPham().setTrangThai("Hoạt động");
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

    /// lọc sản phẩm chi tiết
    public List<SanPhamChiTiet> searchSanPhamChiTiet(String tenSanPham, String tenDanhMuc, String tenThuongHieu,
                                                     String tenPhongCach, String tenChatLieu, String tenKieuDang,
                                                     String tenKieuDaiQuan, String tenMauSac, String tenSize,
                                                     Double minPrice, Double maxPrice) {

        Specification<SanPhamChiTiet> spec = Specification.where(
                SanPhamChiTietSpecification.hasTenSanPhamLike(tenSanPham))
                .and(SanPhamChiTietSpecification.hasDanhMuc(tenDanhMuc))
                .and(SanPhamChiTietSpecification.hasThuongHieu(tenThuongHieu))
                .and(SanPhamChiTietSpecification.hasPhongCach(tenPhongCach))
                .and(SanPhamChiTietSpecification.hasChatLieu(tenChatLieu))
                .and(SanPhamChiTietSpecification.hasKieuDang(tenKieuDang))
                .and(SanPhamChiTietSpecification.hasKieuDaiQuan(tenKieuDaiQuan))
                .and(SanPhamChiTietSpecification.hasMauSac(tenMauSac))
                .and(SanPhamChiTietSpecification.hasSize(tenSize))
                .and(SanPhamChiTietSpecification.isPriceBetween(minPrice, maxPrice));

        return sanPhamChiTietRepository.findAll(spec);
    }
}
