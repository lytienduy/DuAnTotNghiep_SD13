package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.TopProductDTO;
import com.example.shopdragonbee.repository.TopProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopProductService {
    private final TopProductRepository repository;

//    private List<TopProductDTO> convertToDTO(List<Object[]> results) {
//        return results.stream().map(row -> new TopProductDTO(
//                row[0] != null ? row[0].toString() : "",  // Danh sách ảnh
//                row[1].toString(),  // Mô tả
//                Integer.parseInt(row[2].toString()), // Số lượng bán
//                new BigDecimal(row[3].toString()) // Giá
//        )).collect(Collectors.toList());
//    }
//
//    public List<TopProductDTO> getTopProductsToday() {
//        return convertToDTO(repository.findTopProductsToday());
//    }
//
//    public List<TopProductDTO> getTopProductsThisWeek() {
//        return convertToDTO(repository.findTopProductsThisWeek());
//    }
//
//    public List<TopProductDTO> getTopProductsThisMonth() {
//        return convertToDTO(repository.findTopProductsThisMonth());
//    }
//
//    public List<TopProductDTO> getTopProductsThisYear() {
//        return convertToDTO(repository.findTopProductsThisYear());
//    }
//
//    public List<TopProductDTO> getBestSellingBetween(String startDate, String endDate) {
//        List<Object[]> rawData = repository.findTopBestSellingBetween(startDate, endDate);
//
//        return rawData.stream().map(row -> {
//            // row[0] = anhSanPham
//            // row[1] = moTa
//            // row[2] = soLuongBan
//            // row[3] = giaBan
//            String imageUrls = row[0] != null ? row[0].toString() : "";
//            String description = row[1] != null ? row[1].toString() : "";
//            Long totalSold = row[2] != null ? Long.valueOf(row[2].toString()) : 0L;
//            Double price = row[3] != null ? Double.valueOf(row[3].toString()) : 0.0;
//
//            return new TopProductDTO(imageUrls, description, totalSold, price);
//        }).collect(Collectors.toList());
//    }

    private List<TopProductDTO> convertToDTO(List<Object[]> rawData) {
        return rawData.stream().map(row -> {
            // row[0] = danh_sach_anh (String)
            // row[1] = mo_ta (String)
            // row[2] = tong_ban (Number)
            // row[3] = gia (Number)
            String imageUrls   = row[0] != null ? row[0].toString() : "";
            String description = row[1] != null ? row[1].toString() : "";
            int totalSold      = row[2] != null ? Integer.parseInt(row[2].toString()) : 0;
            BigDecimal price   = row[3] != null ? new BigDecimal(row[3].toString()) : BigDecimal.ZERO;

            return new TopProductDTO(imageUrls, description, totalSold, price);
        }).collect(Collectors.toList());
    }

    public List<TopProductDTO> getTopProductsToday() {
        List<Object[]> rawData = repository.findTopProductsToday();
        return convertToDTO(rawData);
    }

    public List<TopProductDTO> getTopProductsThisWeek() {
        List<Object[]> rawData = repository.findTopProductsThisWeek();
        return convertToDTO(rawData);
    }

    public List<TopProductDTO> getTopProductsThisMonth() {
        List<Object[]> rawData = repository.findTopProductsThisMonth();
        return convertToDTO(rawData);
    }

    public List<TopProductDTO> getTopProductsThisYear() {
        List<Object[]> rawData = repository.findTopProductsThisYear();
        return convertToDTO(rawData);
    }

    public List<TopProductDTO> getTopProductsBetween(String startDate, String endDate) {
        List<Object[]> rawData = repository.findTopBestSellingBetween(startDate, endDate);
        return convertToDTO(rawData);
    }
}

