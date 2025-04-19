package com.example.shopdragonbee.controller.Client;

import com.example.shopdragonbee.dto.Client.GioHangDTO;
import com.example.shopdragonbee.dto.Client.HomeDTO;
import com.example.shopdragonbee.dto.Client.SPCTDTO;
import com.example.shopdragonbee.entity.SanPham;
import com.example.shopdragonbee.repository.SanPhamChiTietRepositoryP;
import com.example.shopdragonbee.repository.SanPhamRepositoryP;
import com.example.shopdragonbee.service.Client.HomeService;
import com.example.shopdragonbee.service.Client.SanPhamChiTietClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/spctClient")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class SanPhamChiTietClientController {
    @Autowired
    private SanPhamChiTietClientService sanPhamChiTietClientService;

    @PostMapping("/getListSanPhamChiTietTheoMau/{idSanPham}")
    public SPCTDTO.SanPhamChiTietClient getListHienThiTrongSanPhamChiTiet(@PathVariable Integer idSanPham, @RequestBody GioHangDTO.DuLieuDataBodyTrongGioHang requestData) {
        return sanPhamChiTietClientService.getSanPhamChiTietClient(idSanPham, requestData.getIdKhachHang(), requestData.getCart());
    }

    @GetMapping("/getListSanPhamTuongTu/{idSanPham}")
    public List<HomeDTO.SanPhamClient> getListSanPhamTuongTu(@PathVariable Integer idSanPham, @RequestParam String tenDanhMuc) {
        return sanPhamChiTietClientService.getListSanPhamTuongTu(idSanPham, tenDanhMuc);
    }
}
