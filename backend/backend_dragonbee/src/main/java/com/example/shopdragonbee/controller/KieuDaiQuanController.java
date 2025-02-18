package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.dto.KieuDaiQuanDTO;
import com.example.shopdragonbee.service.KieuDaiQuanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kieudaiquan")
@CrossOrigin(origins = "http://localhost:3000")
public class KieuDaiQuanController {

    private final KieuDaiQuanService kieuDaiQuanService;

    public KieuDaiQuanController(KieuDaiQuanService kieuDaiQuanService) {
        this.kieuDaiQuanService = kieuDaiQuanService;
    }

    // API lấy danh sách kiểu đai quần
    @GetMapping
    public List<KieuDaiQuanDTO> getAllKieuDaiQuan() {
        return kieuDaiQuanService.getAllKieuDaiQuan();
    }

    // API thêm kiểu đai quần mới
    @PostMapping("/add")
    public ResponseEntity<?> addKieuDaiQuan(@RequestBody KieuDaiQuanDTO kieuDaiQuanDTO) {
        // Kiểm tra nếu tên kiểu đai quần đã tồn tại trong cơ sở dữ liệu
        if (kieuDaiQuanService.isNameExist(kieuDaiQuanDTO.getTenKieuDaiQuan())) {
            // Nếu tên đã tồn tại, trả về thông báo mà không phải lỗi 400
            return ResponseEntity.ok(
                    Map.of("message", "Tên kiểu đai quần đã tồn tại, vui lòng chọn tên khác.")
            );
        }

        // Thêm kiểu đai quần mới vào database nếu tên chưa tồn tại
        KieuDaiQuanDTO newKieuDaiQuan = kieuDaiQuanService.addKieuDaiQuan(kieuDaiQuanDTO);
        return ResponseEntity.ok(newKieuDaiQuan);
    }

}