package com.example.shopdragonbee.controller;
import com.example.shopdragonbee.dto.ProductOutOfStockDTO;
import com.example.shopdragonbee.respone.SanPhamCTResponse;
import com.example.shopdragonbee.service.SanPhamService;
import com.example.shopdragonbee.service.ThongKeSPService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ThongKeSPCTController {
    private final ThongKeSPService sanPhamService;

    /**
     * API trả về danh sách sản phẩm sắp hết hàng theo ngưỡng số lượng.
     * Ví dụ: /api/products/out-of-stock?quantity=10
     */
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<ProductOutOfStockDTO>> getSanPhamSapHetHang(
            @RequestParam("quantity") int quantity) {
        List<ProductOutOfStockDTO> list = sanPhamService.getSanPhamSapHetHang(quantity);
        return ResponseEntity.ok(list);
    }

    /**
     * API trả về danh sách sản phẩm sắp hết hàng theo ngưỡng số lượng,
     * mặc định 5 phần tử một trang.
     * Ví dụ: /api/products/out-of-stock?quantity=10&page=1
     */
    @GetMapping("/page-out-of-stock")
    public ResponseEntity<Map<String, Object>> getSanPhamSapHetHang(
            @RequestParam("quantity") int quantity,
            @RequestParam(value = "page", defaultValue = "1") int page
    ) {
        Map<String, Object> result = sanPhamService.getSanPhamSapHetHangPaging(quantity, page);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/low-stock")
    public List<Object[]> getLowStockProducts() {
        return sanPhamService.getTop2SanPhamSapHetHang();
    }
}
