package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.AnhSanPhamDTO;
import com.example.shopdragonbee.entity.AnhSanPham;
import com.example.shopdragonbee.entity.SanPhamChiTiet;
import com.example.shopdragonbee.service.AnhSanPhamService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/anh-san-pham")
public class AnhSanPhamController {

    @Autowired
    private AnhSanPhamService anhSanPhamService;

    @Autowired
    private RestTemplate restTemplate;

    // Cấu hình thông tin Cloudinary từ application.properties
    @Value("${cloudinary.api.key}")
    private String cloudinaryApiKey;

    @Value("${cloudinary.cloud.name}")
    private String cloudinaryCloudName;

    @Value("${cloudinary.api.secret}")
    private String cloudinaryApiSecret;

    // API thêm nhiều ảnh cho sản phẩm chi tiết
    @PostMapping("/{sanPhamChiTietId}")
    public ResponseEntity<?> addAnhs(@PathVariable Integer sanPhamChiTietId,
                                     @RequestBody List<AnhSanPhamDTO> anhSanPhamList) {
        // Kiểm tra các ảnh trong danh sách
        for (AnhSanPhamDTO anh : anhSanPhamList) {
            if (anh.getAnhUrl() == null || anh.getAnhUrl().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Ảnh URL không hợp lệ!");
            }
            if (anh.getTrangThai() == null || anh.getTrangThai().trim().isEmpty()) {
                anh.setTrangThai("Hoạt động");
            }
        }

        // Chuyển DTO thành Entity
        List<AnhSanPham> newAnhs = anhSanPhamList.stream().map(dto -> {
            AnhSanPham anh = new AnhSanPham();
            anh.setAnhUrl(dto.getAnhUrl());
            anh.setMa(dto.getMa());
            anh.setMoTa(dto.getMoTa());
            anh.setTrangThai(dto.getTrangThai());
            anh.setSanPhamChiTiet(SanPhamChiTiet.builder().id(sanPhamChiTietId).build()); // Đảm bảo ID được gán đúng
            return anh;
        }).collect(Collectors.toList());

        try {
            List<AnhSanPham> savedAnhs = anhSanPhamService.addAnhsToSanPhamChiTiet(sanPhamChiTietId, newAnhs);
            return ResponseEntity.ok(savedAnhs); // Trả về các ảnh đã lưu
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Lỗi khi thêm ảnh: " + e.getMessage()));
        }
    }




    // ErrorResponse class
    public class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        // Getter and Setter
        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // API lấy tất cả ảnh của một sản phẩm chi tiết
    @GetMapping("/{sanPhamChiTietId}")
    public ResponseEntity<List<AnhSanPham>> getAllAnh(@PathVariable Integer sanPhamChiTietId) {
        List<AnhSanPham> anhList = anhSanPhamService.getAllAnhBySanPhamChiTietId(sanPhamChiTietId);
        return ResponseEntity.ok(anhList);
    }

    // API lấy ảnh từ Cloudinary (dành cho frontend để chọn ảnh)
    @GetMapping("/cloudinary-images")
    public ResponseEntity<Object> getCloudinaryImages() {
        String url = "https://api.cloudinary.com/v1_1/" + cloudinaryCloudName + "/resources/image";

        // Sử dụng thư mục 'anh'
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("max_results", 50) // Giới hạn số lượng ảnh trả về
                .queryParam("prefix", "anh/") // Lấy ảnh từ thư mục 'anh'
                .queryParam("type", "upload");  // Chỉ lấy ảnh đã tải lên

        // Cấu hình Basic Authentication với API Key và API Secret
        String authValue = "Basic " + java.util.Base64.getEncoder().encodeToString((cloudinaryApiKey + ":" + cloudinaryApiSecret).getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authValue);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Gửi yêu cầu GET tới Cloudinary
        ResponseEntity<Object> response = restTemplate.exchange(
                uriBuilder.toUriString(),
                HttpMethod.GET,
                entity,
                Object.class
        );

        // Trả về dữ liệu nếu yêu cầu thành công
        if (response.getStatusCode().is2xxSuccessful()) {
            return response;
        } else {
            return ResponseEntity.status(response.getStatusCode()).body("Không thể lấy ảnh từ Cloudinary");
        }
    }
}
