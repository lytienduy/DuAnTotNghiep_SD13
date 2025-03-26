package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.ChatLieuDTO;
import com.example.shopdragonbee.dto.DanhMucDTO;
import com.example.shopdragonbee.dto.KieuDaiQuanDTO;
import com.example.shopdragonbee.dto.KieuDangDTO;
import com.example.shopdragonbee.dto.MauSacDTO;
import com.example.shopdragonbee.dto.PhongCachDTO;
import com.example.shopdragonbee.dto.ProductOutOfStockDTO;
import com.example.shopdragonbee.dto.SanPhamDTO;
import com.example.shopdragonbee.dto.SizeDTO;
import com.example.shopdragonbee.dto.ThuongHieuDTO;
import com.example.shopdragonbee.dto.XuatXuDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.*;
import com.example.shopdragonbee.respone.SanPhamChiTietRespone;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
    private final AnhSanPhamRepository anhSanPhamRepository;

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
        Page<SanPhamChiTiet> entityPage = sanPhamChiTietRepository.findAllWithJoins(pageable);
        return mapEntityPageToResponse(entityPage, pageable);
    }

    public Page<SanPhamChiTietRespone> getSanPhamChiTietBySanPhamId(Integer id, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamChiTiet> entityPage = sanPhamChiTietRepository.findBySanPhamIdWithJoins(id, pageable);
        return mapEntityPageToResponse(entityPage, pageable);
    }

    private Page<SanPhamChiTietRespone> mapEntityPageToResponse(Page<SanPhamChiTiet> entityPage, Pageable pageable) {
        List<SanPhamChiTietRespone> responseList = entityPage.getContent().stream()
                .map(this::convertToRespone)
                .collect(Collectors.toList());

        Page<SanPhamChiTietRespone> page = new PageImpl<>(responseList, pageable, entityPage.getTotalElements());

        return addAnhUrlsToResponse(page);
    }

    private SanPhamChiTietRespone convertToRespone(SanPhamChiTiet entity) {
        return new SanPhamChiTietRespone(
                entity.getId(),
                entity.getMa(),
                entity.getSanPham() != null ? entity.getSanPham().getTenSanPham() : null,

                entity.getDanhMuc() != null ? new DanhMucDTO(entity.getDanhMuc().getId(), entity.getDanhMuc().getTenDanhMuc()) : null,
                entity.getThuongHieu() != null ? new ThuongHieuDTO(entity.getThuongHieu().getId(), entity.getThuongHieu().getTenThuongHieu()) : null,
                entity.getPhongCach() != null ? new PhongCachDTO(entity.getPhongCach().getId(), entity.getPhongCach().getTenPhongCach()) : null,
                entity.getChatLieu() != null ? new ChatLieuDTO(entity.getChatLieu().getId(), entity.getChatLieu().getTenChatLieu()) : null,
                entity.getMauSac() != null ? new MauSacDTO(entity.getMauSac().getId(), entity.getMauSac().getTenMauSac()) : null,
                entity.getSize() != null ? new SizeDTO(entity.getSize().getId(), entity.getSize().getTenSize()) : null,
                entity.getKieuDang() != null ? new KieuDangDTO(entity.getKieuDang().getId(), entity.getKieuDang().getTenKieuDang()) : null,
                entity.getKieuDaiQuan() != null ? new KieuDaiQuanDTO(entity.getKieuDaiQuan().getId(), entity.getKieuDaiQuan().getTenKieuDaiQuan()) : null,
                entity.getXuatXu() != null ? new XuatXuDTO(entity.getXuatXu().getId(), entity.getXuatXu().getTenXuatXu()) : null,

                entity.getSoLuong(),
                entity.getGia(),
                entity.getTrangThai(),

                null // anhUrls sẽ được thêm ở bước dưới
        );
    }

    private Page<SanPhamChiTietRespone> addAnhUrlsToResponse(Page<SanPhamChiTietRespone> page) {
        List<Integer> ids = page.getContent().stream().map(SanPhamChiTietRespone::getId).toList();
        if (ids.isEmpty()) return page;

        List<Object[]> anhData = anhSanPhamRepository.findAnhSanPhamBySanPhamChiTietIds(ids);
        Map<Integer, List<String>> anhMap = anhData.stream()
                .collect(Collectors.groupingBy(
                        row -> (Integer) row[0],
                        Collectors.mapping(row -> (String) row[1], Collectors.toList())
                ));

        page.getContent().forEach(spct -> spct.setAnhUrls(anhMap.getOrDefault(spct.getId(), List.of())));
        return page;
    }

    // tìm kiếm
    public Page<SanPhamDTO> searchSanPham(String tenSanPham, String trangThai, Pageable pageable) {
        return sanPhamRepository.searchSanPham(tenSanPham, trangThai, pageable);
    }
// chuyển đổi trạng thái
public String toggleProductStatus(Integer id) {
    Optional<SanPham> optionalSanPham = sanPhamRepository.findById(id);
    if (optionalSanPham.isPresent()) {
        SanPham sanPham = optionalSanPham.get();
        String oldStatus = sanPham.getTrangThai();
        String newStatus = oldStatus.equals("Hoạt động") ? "Ngừng bán" : "Hoạt động"; // Chuyển đổi giữa "Đang bán" và "Ngừng bán"

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
        sanPham.setTrangThai("Hoạt động");

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
            newSanPhamChiTiet.setTrangThai("Hoạt động");
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
