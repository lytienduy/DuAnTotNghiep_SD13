package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.KhachHangAddBTQDTO;
import com.example.shopdragonbee.dto.KhachHangBTQDTO;
import com.example.shopdragonbee.dto.PhieuGiamGiaDTO;
import com.example.shopdragonbee.entity.*;
import com.example.shopdragonbee.repository.DiaChiRepository;
import com.example.shopdragonbee.repository.KhachHangRepository;
import com.example.shopdragonbee.repository.TaiKhoanRepository;
import com.example.shopdragonbee.repository.VaiTroRepositoty;
import com.example.shopdragonbee.service.DiaChiService;
import com.example.shopdragonbee.service.KhachHangService;
import com.example.shopdragonbee.service.PhieuGiamGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dragonbee")
@CrossOrigin(origins = "http://localhost:3000")
public class BanTaiQuayDController {

    @Autowired
    private KhachHangService khachHangService;

    @Autowired
    private PhieuGiamGiaService phieuGiamGiaService;

    @Autowired
    private DiaChiService diaChiService;

    @Autowired
    private VaiTroRepositoty vaiTroRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private DiaChiRepository diaChiRepository;

    @GetMapping("/tim-kiem-khach-hang")
    public List<KhachHangBTQDTO> timKiemKhachHang(@RequestParam String keyword) {
        // Lấy danh sách khách hàng từ service
        List<KhachHang> khachHangs = khachHangService.timKiemKhachHang(keyword);

        // Chuyển sang DTO để trả về cho client
        return khachHangs.stream()
                .map(KhachHangBTQDTO::new)
                .collect(Collectors.toList());
    }

    //tìm phiếu giảm giá
    @GetMapping("/tim-kiem-phieu-giam-gia")
    public List<PhieuGiamGiaDTO> timKiemPhieuGiamGia(
            @RequestParam String keyword,
            @RequestParam(required = false) Integer idKhachHang) {

        // Lấy danh sách phiếu giảm giá từ service
        List<PhieuGiamGia> phieuGiamGias = phieuGiamGiaService.timKiemPhieuGiamGia(keyword, idKhachHang);

        // Chuyển danh sách phiếu giảm giá thành DTO để trả về client
        return phieuGiamGias.stream()
                .map(PhieuGiamGiaDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping("/them-dia-chi")
    public ResponseEntity<String> themDiaChi(@RequestBody DiaChi diaChi) {
        try {
            diaChiService.themDiaChi(diaChi);  // Gọi service để thêm địa chỉ vào cơ sở dữ liệu
            return ResponseEntity.ok("Thêm địa chỉ thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Có lỗi khi thêm địa chỉ: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra khi thêm địa chỉ.");
        }
    }

    // API để lấy danh sách địa chỉ của khách hàng theo customerId
    @GetMapping("/danh-sach-dia-chi")
    public List<DiaChi> layDiaChi(@RequestParam Integer customerId) {
        try {
            // Gọi service để lấy danh sách địa chỉ của khách hàng
            return diaChiService.layDiaChiTheoKhachHang(customerId);
        } catch (Exception e) {
            throw new RuntimeException("Có lỗi khi lấy danh sách địa chỉ: " + e.getMessage());
        }
    }

    private String generateCustomerCode() {
        // Lấy mã khách hàng lớn nhất hiện tại từ CSDL
        Integer maxMa = khachHangRepository.getMaxMa();

        // Nếu chưa có khách hàng nào, bắt đầu từ KH0001
        int newCode = (maxMa == null) ? 1 : maxMa + 1;

        // Tính độ dài của số để đảm bảo định dạng đúng
        int length = String.format("%d", newCode).length();

        // Đảm bảo mã khách hàng có đủ số chữ số, ví dụ KH000001, KH000002,...
        return String.format("KH%0" + (4) + "d", newCode);  // Chắc chắn rằng số có 6 chữ số
    }


    @PostMapping("/them-khach-hang")
    public ResponseEntity<String> themKhachHang(@RequestBody KhachHangAddBTQDTO khachHangDTO) {
        try {
            // Tạo tài khoản mới
            TaiKhoan taiKhoan = TaiKhoan.builder()
                    .tenNguoiDung(khachHangDTO.getEmail()) // Sử dụng email làm tên người dùng
                    .matKhau("password123")  // Mật khẩu mặc định
                    .trangThai("Hoạt động")  // Trạng thái là "Hoạt động"
                    .ngayTao(LocalDateTime.now()) // Ngày tạo là hiện tại
                    .nguoiTao("system") // Bạn có thể thay đổi giá trị này nếu có thông tin người tạo
                    .build();

            // Tìm vai trò với id = 3
            VaiTro vaiTro = vaiTroRepository.findById(3).orElseThrow(() -> new RuntimeException("Vai trò không tồn tại"));

            taiKhoan.setVaiTro(vaiTro);

            // Lưu tài khoản
            taiKhoan = taiKhoanRepository.save(taiKhoan);

            // Tạo khách hàng
            KhachHang khachHang = KhachHang.builder()
                    .ma(generateCustomerCode()) // Gọi hàm để tạo mã khách hàng
                    .tenKhachHang(khachHangDTO.getTenKhachHang())
                    .ngaySinh(khachHangDTO.getNgaySinh())
                    .gioiTinh(khachHangDTO.getGioiTinh())
                    .sdt(khachHangDTO.getSdt())
                    .email(khachHangDTO.getEmail())
                    .trangThai("Hoạt động")
                    .ngayTao(LocalDateTime.now())
                    .nguoiTao("system")
                    .taiKhoan(taiKhoan) // Gán tài khoản cho khách hàng
                    .build();

            // Thêm địa chỉ
            DiaChi diaChi = DiaChi.builder()
                    .soNha(khachHangDTO.getDiaChi().getSoNha())
                    .duong(khachHangDTO.getDiaChi().getDuong())
                    .xa(khachHangDTO.getDiaChi().getXa())
                    .huyen(khachHangDTO.getDiaChi().getHuyen())
                    .thanhPho(khachHangDTO.getDiaChi().getThanhPho())
                    .moTa(khachHangDTO.getDiaChi().getMoTa())
                    .trangThai("Hoạt động")
                    .macDinh(true) // Địa chỉ mặc định
                    .ngayTao(LocalDateTime.now())
                    .build();

            // Thiết lập liên kết khách hàng - địa chỉ
            diaChi.setKhachHang(khachHang);

            // Lưu khách hàng và địa chỉ
            khachHangRepository.save(khachHang);
            diaChiRepository.save(diaChi);

            return ResponseEntity.ok("Thêm khách hàng và tài khoản thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra khi thêm khách hàng hoặc tài khoản.");
        }
    }

    // Endpoint để kiểm tra số lượng voucher còn lại
    @GetMapping("/kiem-tra-voucher/{voucherCode}")
    public PhieuGiamGiaDTO checkVoucherAvailability(@PathVariable String voucherCode) {
        return phieuGiamGiaService.checkVoucherAvailability(voucherCode);
    }

}
