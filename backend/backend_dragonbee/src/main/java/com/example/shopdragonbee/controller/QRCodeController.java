package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.service.QRCodeService;
import com.example.shopdragonbee.repository.SanPhamChiTietRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class QRCodeController {

    private final QRCodeService qrCodeService;
    private final SanPhamChiTietRepository sanPhamChiTietRepository; // Inject repository

    public QRCodeController(QRCodeService qrCodeService, SanPhamChiTietRepository sanPhamChiTietRepository) {
        this.qrCodeService = qrCodeService;
        this.sanPhamChiTietRepository = sanPhamChiTietRepository;
    }

    @GetMapping("/qr-code/{productDetailId}")
    public ResponseEntity<byte[]> downloadQRCode(@PathVariable Integer productDetailId) {
        // Thay thế findProductDetailById bằng việc truy vấn qua repository
        SanPhamChiTiet productDetail = sanPhamChiTietRepository.findById(productDetailId)
                .orElse(null);  // Trả về null nếu không tìm thấy sản phẩm chi tiết

        if (productDetail == null) {
            return ResponseEntity.status(404).body("Sản phẩm chi tiết không tồn tại.".getBytes());
        }

        String productCode = productDetail.getMa();

        // Kiểm tra nếu mã sản phẩm chi tiết là null hoặc rỗng
        if (productCode == null || productCode.isEmpty()) {
            return ResponseEntity.status(400).body("Mã sản phẩm chi tiết không hợp lệ.".getBytes());
        }

        try {
            byte[] qrCode = qrCodeService.generateQRCode(productCode);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDispositionFormData("attachment", productCode + ".png");

            return ResponseEntity.ok().headers(headers).body(qrCode);
        } catch (Exception e) {
            // Xử lý lỗi khi tạo mã QR
            e.printStackTrace(); // Log lỗi ra console để debug
            return ResponseEntity.status(500).body("Lỗi khi tạo mã QR.".getBytes());
        }
    }
}
