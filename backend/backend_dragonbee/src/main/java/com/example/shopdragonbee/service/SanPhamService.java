package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.SanPhamDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.*;
import com.example.shopdragonbee.respone.SanPhamChiTietRespone;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    private final XuatXuRepository xuatXuRepository;
    private final ChatLieuRepository chatLieuRepository;
    private final KieuDangRepository kieuDangRepository;
    private final KieuDaiQuanRepository kieuDaiQuanRepository;
    private final MauSacRepository mauSacRepository;
    private final SizeRepository sizeRepository;

    public List<SanPhamDTO> getAllSanPham() {
        return sanPhamRepository.getAll();
    }

    // API lấy tất cả sản phẩm (có phân trang)
    public Page<SanPhamDTO> getAllSanPhamPaged(Pageable pageable) {
        return sanPhamRepository.getAllPaged(pageable);
    }
    public SanPham getSanPhamById(Integer id) {
        return sanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + id));
    }
    public DanhMuc getDanhMucById(Integer id) {
        return danhMucRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    public ThuongHieu getThuongHieuById(Integer id) {
        return thuongHieuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thương hiệu không tồn tại với ID: " + id));
    }

    public PhongCach getPhongCachById(Integer id) {
        return phongCachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Phong cách không tồn tại với ID: " + id));
    }

    public ChatLieu getChatLieuById(Integer id) {
        return chatLieuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chất liệu không tồn tại với ID: " + id));
    }
    public MauSac getMauSacById(Integer id) {
        return mauSacRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Màu sắc không tồn tại với ID: " + id));
    }

    public Size getSizeById(Integer id) {
        return sizeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Size không tồn tại với ID: " + id));
    }


    public KieuDang getKieuDangById(Integer id) {
        return kieuDangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kiểu dáng không tồn tại với ID: " + id));
    }

    public KieuDaiQuan getKieuDaiQuanById(Integer id) {
        return kieuDaiQuanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kiểu đai quần không tồn tại với ID: " + id));
    }

    public XuatXu getXuatXuById(Integer id) {
        return xuatXuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Xuất xứ không tồn tại với ID: " + id));
    }
    // API lấy tất cả sản phẩm chi tiết có phân trang
    public Page<SanPhamChiTietRespone> getAllSanPhamChiTiet(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return sanPhamChiTietRepository.findAllSanPhamChiTiet(pageable);
    }

    // API lấy sản phẩm chi tiết theo ID sản phẩm cha có phân trang
    public Page<SanPhamChiTietRespone> getSanPhamChiTietBySanPhamId(Integer id, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return sanPhamChiTietRepository.findBySanPhamId(id, pageable);
    }
    public Page<SanPhamDTO> searchSanPham(String tenSanPham, String trangThai, Pageable pageable) {
        return sanPhamRepository.searchSanPham(tenSanPham, trangThai, pageable);
    }
// chuyển đổi trạng thái
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
// add sản phẩm chi tiết
    public SanPhamChiTiet addSanPhamChiTiet(SanPhamChiTiet newSanPhamChiTiet) {
        // Tạo mã sản phẩm (ma)
        String newMa = generateProductCode();
        newSanPhamChiTiet.setMa(newMa);

        // Đặt trạng thái dựa trên số lượng
        if (newSanPhamChiTiet.getSoLuong() > 0) {
            newSanPhamChiTiet.setTrangThai("Còn hàng");
        } else {
            newSanPhamChiTiet.setTrangThai("Hết hàng");
        }

        newSanPhamChiTiet.setNgayTao(LocalDateTime.now());
        newSanPhamChiTiet.setNguoiTao("Admin"); // Hoặc đặt tự động theo người dùng hiện tại

        return sanPhamChiTietRepository.save(newSanPhamChiTiet);
    }

    public String generateProductCode() {
        Integer maxId = sanPhamChiTietRepository.getMaxId();  // Truy vấn max ID từ cơ sở dữ liệu
        if (maxId == null || maxId < 0) {
            maxId = 0;  // Nếu không có giá trị hợp lệ, sử dụng giá trị mặc định
        }
        return "SPCT" + (maxId + 1);  // Tạo mã sản phẩm chi tiết
    }


}
