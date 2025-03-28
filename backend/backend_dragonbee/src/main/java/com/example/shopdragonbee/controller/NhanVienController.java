package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.NhanVienRequestDTO;
import com.example.shopdragonbee.entity.NhanVien;
import com.example.shopdragonbee.repository.NhanVienRepository;
import com.example.shopdragonbee.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.*;


@RestController
@RequestMapping("/api/nhanvien")
@CrossOrigin(origins = "http://localhost:3000")
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;


    @Autowired
    private NhanVienRepository nhanVienRepository;

    // Lấy danh sách nhân viên
    @GetMapping
    public List<NhanVien> getAllNhanVien() {
        return nhanVienRepository.findAllByOrderByNgayTaoDesc();
    }

    // Lấy nhân viên theo ID
    @GetMapping("/{id}")
    public ResponseEntity<NhanVien> getNhanVienById(@PathVariable Integer id) {
        Optional<NhanVien> nhanVien = nhanVienRepository.findById(id);
        return nhanVien.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


//    @PostMapping("/them-moi")
//    public ResponseEntity<?> themMoiNhanVien(@RequestBody NhanVienRequestDTO dto) {
//        try {
//            NhanVien nhanVien = nhanVienService.themMoiNhanVien(dto);
//            return ResponseEntity.ok(nhanVien);
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
@PostMapping("/them-moi")
public ResponseEntity<?> themMoiNhanVien(
        @RequestParam("tenNhanVien") String tenNhanVien,
        @RequestParam("ngaySinh") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngaySinh,
        @RequestParam("gioiTinh") String gioiTinh,
        @RequestParam("sdt") String sdt,
        @RequestParam("email") String email,
        @RequestParam("tinhThanh") String tinhThanh,
        @RequestParam("quanHuyen") String quanHuyen,
        @RequestParam("xaPhuong") String xaPhuong,
        @RequestParam("soNha") String soNha,
        @RequestParam(value = "anh", required = false) MultipartFile anh,
        @RequestParam("cccd") String cccd,
        @RequestParam("trangThai") String trangThai,
        @RequestParam("nguoiTao") String nguoiTao
        // Bỏ luôn @RequestParam("idTaiKhoan")
) {
    try {
        NhanVienRequestDTO dto = new NhanVienRequestDTO();
        dto.setTenNhanVien(tenNhanVien);
        dto.setNgaySinh(ngaySinh);
        dto.setGioiTinh(gioiTinh);
        dto.setSdt(sdt);
        dto.setEmail(email);
        dto.setTinhThanh(tinhThanh);
        dto.setQuanHuyen(quanHuyen);
        dto.setXaPhuong(xaPhuong);
        dto.setSoNha(soNha);
        dto.setAnh(anh);
        dto.setCccd(cccd);
        dto.setTrangThai(trangThai);
        dto.setNguoiTao(nguoiTao);

        NhanVien nhanVien = nhanVienService.themMoiNhanVien(dto);
        return ResponseEntity.ok(nhanVien);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}


//    @PostMapping("/them-moi")
//    public ResponseEntity<?> themMoiNhanVien(
//            @RequestParam("tenNhanVien") String tenNhanVien,
//            @RequestParam("ngaySinh") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngaySinh,
//            @RequestParam("gioiTinh") String gioiTinh,
//            @RequestParam("sdt") String sdt,
//            @RequestParam("email") String email,
//            @RequestParam("tinhThanh") String tinhThanh,
//            @RequestParam("quanHuyen") String quanHuyen,
//            @RequestParam("xaPhuong") String xaPhuong,
//            @RequestParam("soNha") String soNha,
//            @RequestParam(value = "anh", required = false) MultipartFile anh,
//            @RequestParam("cccd") String cccd,
//            @RequestParam("trangThai") String trangThai,
//            @RequestParam("nguoiTao") String nguoiTao
////            @RequestParam("idTaiKhoan") Integer idTaiKhoan
//    ) {
//        try {
//            NhanVienRequestDTO dto = new NhanVienRequestDTO();
//            dto.setTenNhanVien(tenNhanVien);
//            dto.setNgaySinh(ngaySinh);
//            dto.setGioiTinh(gioiTinh);
//            dto.setSdt(sdt);
//            dto.setEmail(email);
//            dto.setTinhThanh(tinhThanh);
//            dto.setQuanHuyen(quanHuyen);
//            dto.setXaPhuong(xaPhuong);
//            dto.setSoNha(soNha);
//            dto.setAnh(anh);
//            dto.setCccd(cccd);
//            dto.setTrangThai(trangThai);
//            dto.setNguoiTao(nguoiTao);
////            dto.setIdTaiKhoan(idTaiKhoan);
//
//            NhanVien nhanVien = nhanVienService.themMoiNhanVien(dto);
//            return ResponseEntity.ok(nhanVien);
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }


    private static final String UPLOAD_DIR = "E:/uploads/";

    // Cập nhật nhân viên
    @PutMapping("/{id}")
    public ResponseEntity<NhanVien> updateNhanVien(@PathVariable Integer id, @RequestBody NhanVien nhanVienDetails) {
        if (nhanVienRepository.existsById(id)) {
            nhanVienDetails.setId(id);
            NhanVien updatedNhanVien = nhanVienRepository.save(nhanVienDetails);
            return ResponseEntity.ok(updatedNhanVien);
        }
        return ResponseEntity.notFound().build();
    }

    // API Upload ảnh
    @PostMapping("/upload-anh")
    public ResponseEntity<String> uploadAnh(@RequestParam("anh") MultipartFile file) {
        try {
            // Kiểm tra nếu file rỗng
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File ảnh không được để trống!");
            }

            // Tạo tên file mới để tránh trùng lặp
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            // Kiểm tra thư mục lưu ảnh, nếu chưa có thì tạo mới
            Files.createDirectories(filePath.getParent());

            // Lưu file vào thư mục
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Trả về đường dẫn ảnh
            String fileUrl = "http://localhost:8080/uploads/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi upload ảnh: " + e.getMessage());
        }
    }



    // Xóa nhân viên
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNhanVien(@PathVariable Integer id) {
        if (nhanVienRepository.existsById(id)) {
            nhanVienRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/phan-trang")  // Lấy nhân viên có phân trang
    public ResponseEntity<Page<NhanVien>> getNhanVienPhanTrang(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NhanVien> nhanViens = nhanVienRepository.findAll(pageable);
        return ResponseEntity.ok(nhanViens);
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<List<NhanVien>> searchNhanVien(@RequestParam String keyword) {
        List<NhanVien> nhanViens = nhanVienRepository.searchNhanVien(keyword);
        return ResponseEntity.ok(nhanViens);
    }

    @GetMapping("/loc-trang-thai")
    public ResponseEntity<List<NhanVien>> filterByTrangThai(@RequestParam String trangThai) {
        List<NhanVien> nhanViens = nhanVienRepository.findByTrangThai(trangThai);
        return ResponseEntity.ok(nhanViens);
    }

    @GetMapping("/loc-gioi-tinh")
    public ResponseEntity<List<NhanVien>> filterByGioiTinh(@RequestParam String gioiTinh) {
        List<NhanVien> nhanViens = nhanVienRepository.findByGioiTinh(gioiTinh);
        return ResponseEntity.ok(nhanViens);
    }

    @GetMapping("/loc-tuoi")
    public ResponseEntity<List<NhanVien>> filterByAgeRange(
            @RequestParam(defaultValue = "18") int minAge,
            @RequestParam(defaultValue = "60") int maxAge) {
        List<NhanVien> nhanViens = nhanVienRepository.findByAgeRange(minAge, maxAge);
        return ResponseEntity.ok(nhanViens);
    }

    @GetMapping("/check-phone")
    public ResponseEntity<Map<String, Boolean>> checkPhone(@RequestParam String sdt) {
        boolean exists = nhanVienRepository.existsBySdt(sdt);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/doi-trang-thai")
    public ResponseEntity<String> toggleStatus(@PathVariable Integer id) {
        Optional<NhanVien> optionalNhanVien = nhanVienRepository.findById(id);
        if (optionalNhanVien.isPresent()) {
            NhanVien nv = optionalNhanVien.get();
            nv.setTrangThai(nv.getTrangThai().equalsIgnoreCase("Hoạt động") ? "Vô hiệu hóa" : "Hoạt động");
            nhanVienRepository.save(nv);
            return ResponseEntity.ok("Trạng thái đã thay đổi thành: " + nv.getTrangThai());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy nhân viên");
    }

    @GetMapping("/check-cccd")
    public ResponseEntity<?> checkCCCD(@RequestParam String cccd) {
        boolean exists = nhanVienService.existsByCccd(cccd);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    @PostMapping("/scan-qr")
    public ResponseEntity<?> scanQR(@RequestBody String qrData) {
        try {
            // Phân tích dữ liệu QR thành DTO
            NhanVienRequestDTO nhanVienDTO = nhanVienService.parseQRCodeData(qrData);

            // Kiểm tra xem CCCD đã tồn tại chưa
            if (nhanVienService.isNhanVienExists(nhanVienDTO.getCccd())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Nhân viên này đã tồn tại.");
            }

            // Trả về thông tin nhân viên
            return ResponseEntity.ok(nhanVienDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Lỗi trong quá trình quét QR hoặc dữ liệu không hợp lệ.");
        }
    }
    @PostMapping("/import")
    public ResponseEntity<Map<String, String>> importExcel(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        if (file.isEmpty()) {
            response.put("message", "File không được để trống!");
            return ResponseEntity.badRequest().body(response);
        }
        String message = nhanVienService.importNhanVien(file);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }



}