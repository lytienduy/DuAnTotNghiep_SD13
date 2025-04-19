package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.HoaDonChiTietResponseDTO;
import com.example.shopdragonbee.dto.HoaDonResponseDTO;
import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.entity.LichSuHoaDon;
import com.example.shopdragonbee.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hoa-don")
// Cho phép gọi API từ frontend
//@CrossOrigin(origins = "*")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class HoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

    @GetMapping("/loc")
    public List<HoaDonResponseDTO> filterInvoices(
            @RequestParam(required = false) String timKiem,
            @RequestParam(required = false) String tuNgay,
            @RequestParam(required = false) String denNgay,
            @RequestParam(required = false) String loaiDon,
            @RequestParam(required = false) String trangThai) {
        List<HoaDonResponseDTO> hoaDons = hoaDonService.locHoaDon(timKiem, tuNgay, denNgay, loaiDon, trangThai);
        return hoaDons;
    }

    @GetMapping("/count")
    public List<Integer> getHoaDonCount( @RequestParam(required = false) String timKiem,
                                         @RequestParam(required = false) String tuNgay,
                                         @RequestParam(required = false) String denNgay,
                                         @RequestParam(required = false) String loaiDon
                                         ) {
        List<Integer> countMap = hoaDonService.laySoLuongHoaDonTrangThaiVaHoaDon(timKiem, tuNgay, denNgay, loaiDon);
        return countMap;
    }

    @GetMapping("/{id}")
    public HoaDonChiTietResponseDTO.HoaDonChiTietDTO getHoaDonById(@PathVariable Integer id) {
        return hoaDonService.getHoaDonById(id);
    }


    @PostMapping("/cap-nhat-trang-thai-hoa-don/{id}")
    public Boolean capNhatTrangThaiHoaDon(@PathVariable Integer id,  @RequestBody Map<String, String> body) {
        String lyDo = body.get("lyDo");
        String trangThai = body.get("trangThai");
        String hanhDong = body.get("hanhDong");
        return hoaDonService.capNhatTrangThaiHoaDon(id, trangThai, hanhDong,lyDo);
    }

    @GetMapping
    public List<HoaDonResponseDTO> getHoaDons() {
        return hoaDonService.getAllHoaDons();
    }

    // API cập nhật thông tin nhận hàng và lưu lịch sử hành động
    @PostMapping("/cap-nhat-thong-tin-nhan-hang/{id}")
    public Boolean capNhatThongTinNhanHang(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        // Lấy thông tin từ frontend
        String tenNguoiNhan = body.get("tenNguoiNhan");
        String sdt = body.get("sdt");
        String emailNguoiNhan = body.get("emailNguoiNhan");
        String diaChiNhanHang = body.get("diaChiNhanHang");
        Float phiShip = Float.valueOf(body.get("phiShip"));
        String nguoiSua = body.get("nguoiSua");  // Lấy người sửa từ frontend

        // Lấy hóa đơn theo ID
        HoaDon hoaDon = hoaDonService.getHoaDonByIdHD(id);
        if (hoaDon == null) {
            return false; // Không tìm thấy hóa đơn
        }

        // Cập nhật thông tin nhận hàng
        hoaDon.setTenNguoiNhan(tenNguoiNhan);
        hoaDon.setSdt(sdt);
        hoaDon.setEmailNguoiNhan(emailNguoiNhan);
        hoaDon.setDiaChiNhanHang(diaChiNhanHang);
        hoaDon.setPhiShip(phiShip);
        hoaDon.setNgaySua(LocalDateTime.now());  // Lấy thời gian hiện tại là ngày sửa
        hoaDon.setNguoiSua(nguoiSua);  // Người sửa thông tin

        // Lưu lại thông tin hóa đơn đã cập nhật
        hoaDonService.saveHoaDon(hoaDon);

        // Lưu lịch sử hành động "Thay đổi thông tin nhận hàng"
        LichSuHoaDon lichSuHoaDon = LichSuHoaDon.builder()
                .hoaDon(hoaDon)
                .hanhDong("Cập nhật")
                .ghiChu("Cập nhật thông tin nhận hàng!")
                .ngayTao(LocalDateTime.now())
                .ngaySua(LocalDateTime.now())
                .nguoiTao(nguoiSua)
                .nguoiSua(nguoiSua)
                .build();

        hoaDonService.saveLichSuHoaDon(lichSuHoaDon);

        return true;
    }
}
