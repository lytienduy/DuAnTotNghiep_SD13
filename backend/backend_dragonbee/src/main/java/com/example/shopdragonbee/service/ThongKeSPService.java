package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.ProductOutOfStockDTO;
import com.example.shopdragonbee.repository.ThongKeSPCTRepository;
import com.example.shopdragonbee.respone.SanPhamCTResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThongKeSPService {
    private final ThongKeSPCTRepository repository;

    public List<ProductOutOfStockDTO> getSanPhamSapHetHang(int soLuong) {
        List<Object[]> results = repository.findSanPhamSapHetHang(soLuong);
        return results.stream().map(row -> {
            // Giả sử thứ tự của cột trong kết quả trả về: 0: anhSanPham, 1: moTaChiTiet, 2: soLuongTon, 3: giaSanPham
            String anhSanPham = row[0] != null ? row[0].toString() : "";
            String moTaChiTiet = row[1] != null ? row[1].toString() : "";
            int soLuongTon = row[2] != null ? Integer.parseInt(row[2].toString()) : 0;
            double giaSanPham = row[3] != null ? Double.parseDouble(row[3].toString()) : 0;
            return new ProductOutOfStockDTO(anhSanPham, moTaChiTiet, soLuongTon, giaSanPham);
        }).collect(Collectors.toList());
    }

    /**
     * Lấy danh sách sản phẩm sắp hết hàng (dưới ngưỡng soLuong),
     * phân trang với pageSize = 5
     */
    public Map<String, Object> getSanPhamSapHetHangPaging(int soLuong, int page) {
        int pageSize = 5;               // Mặc định 5 phần tử mỗi trang
        int offset = (page - 1) * pageSize;

        // Lấy danh sách dữ liệu
        List<Object[]> rawData = repository.findSanPhamSapHetHangPaging(soLuong, offset, pageSize);

        // Đếm tổng số phần tử
        int totalItems = repository.countSanPhamSapHetHang(soLuong);

        // Tính tổng số trang
        int totalPages = (int) Math.ceil((double) totalItems / pageSize);

        // Chuyển rawData -> List<ProductOutOfStockDTO>
        List<ProductOutOfStockDTO> listDTO = rawData.stream().map(row -> {
            String anhSanPham   = row[0] != null ? row[0].toString() : "";
            String moTaChiTiet  = row[1] != null ? row[1].toString() : "";
            int soLuongTon      = row[2] != null ? Integer.parseInt(row[2].toString()) : 0;
            double giaSanPham   = row[3] != null ? Double.parseDouble(row[3].toString()) : 0;
            return new ProductOutOfStockDTO(anhSanPham, moTaChiTiet, soLuongTon, giaSanPham);
        }).collect(Collectors.toList());

        // Tạo response trả về cho frontend
        Map<String, Object> response = new HashMap<>();
        response.put("data", listDTO);
        response.put("currentPage", page);
        response.put("pageSize", pageSize);
        response.put("totalItems", totalItems);
        response.put("totalPages", totalPages);

        return response;
    }


    public List<Object[]> getTop2SanPhamSapHetHang() {
        return repository.findTop2SanPhamSapHetHang();
    }

}
