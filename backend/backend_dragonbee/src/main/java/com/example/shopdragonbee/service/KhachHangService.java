package com.example.shopdragonbee.service;

import com.example.shopdragonbee.dto.DiaChiDto;
import com.example.shopdragonbee.dto.KhachHangDto;
import com.example.shopdragonbee.entity.DiaChi;
import com.example.shopdragonbee.entity.KhachHang;
import com.example.shopdragonbee.entity.TaiKhoan;
import com.example.shopdragonbee.repository.DiaChiRepository;
import com.example.shopdragonbee.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class KhachHangService {
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private DiaChiRepository diaChiRepository;

    @Autowired
    private TaiKhoanService taiKhoanService;

    public List<KhachHangDto> getAllKhachHang() {
        List<KhachHangDto> khachHangDtoList = new ArrayList<>();
        khachHangRepository.findAll().forEach(khachHang -> {
            khachHangDtoList.add(mapToDto(khachHang));
        });
        return khachHangDtoList;
    }

    public KhachHangDto updateKhachHang(String ma, KhachHangDto khachHangDto) {
        KhachHang khachHang = khachHangRepository.findKhachHangByMa(ma);

        khachHangDto.getDiaChiDtos().forEach(diaChiDto -> {
            if(diaChiDto.getId() == null){
                DiaChi diaChi = new DiaChi();
                diaChi.setSoNha(diaChiDto.getSoNha());
                diaChi.setDuong(diaChiDto.getDuong());
                diaChi.setXa(diaChiDto.getXa());
                diaChi.setHuyen(diaChiDto.getHuyen());
                diaChi.setThanhPho(diaChiDto.getThanhPho());
                diaChi.setKhachHang(khachHang);
                diaChi.setTrangThai("Hoạt động");
                diaChi.setMacDinh(diaChiDto.getMacDinh());
                diaChiRepository.save(diaChi);
            } else {
                DiaChi diaChi = diaChiRepository.findById(diaChiDto.getId()).orElse(null);
                if(diaChi != null){
                    diaChi.setSoNha(diaChiDto.getSoNha());
                    diaChi.setDuong(diaChiDto.getDuong());
                    diaChi.setXa(diaChiDto.getXa());
                    diaChi.setHuyen(diaChiDto.getHuyen());
                    diaChi.setThanhPho(diaChiDto.getThanhPho());
                    diaChiRepository.save(diaChi);
                }
            }
        });
        khachHang.setTenKhachHang(khachHangDto.getTenKhachHang());
        khachHang.setEmail(khachHangDto.getEmail());
        khachHang.setSdt(khachHangDto.getSdt());
        khachHang.setNgaySinh(khachHangDto.getNgaySinh());
        khachHang.setGioiTinh(khachHangDto.getGioiTinh());
        khachHang.setTrangThai(khachHangDto.getTrangThai());
        KhachHang updatedKhachHang = khachHangRepository.save(khachHang);
        return mapToDto(updatedKhachHang);
    }

    public KhachHangDto mapToDto(KhachHang khachHang) {
        return new KhachHangDto(khachHang.getMa(), khachHang.getTenKhachHang(), khachHang.getEmail(), khachHang.getNgaySinh(), khachHang.getGioiTinh(), khachHang.getSdt(), khachHang.getTrangThai(), khachHang.getDiaChis().stream().map(DiaChiService::mapToDto).toList());
    }

    public KhachHang mapToEntity(KhachHangDto khachHangDto) {
        KhachHang khachHang = new KhachHang();
        khachHang.setTenKhachHang(khachHangDto.getTenKhachHang());
        khachHang.setEmail(khachHangDto.getEmail());
        khachHang.setSdt(khachHangDto.getSdt());
        khachHang.setNgaySinh(khachHangDto.getNgaySinh());
        khachHang.setGioiTinh(khachHangDto.getGioiTinh());
        khachHang.setTrangThai(khachHangDto.getTrangThai());
        return khachHang;
    }

    public KhachHangDto addKhachHang(KhachHangDto khachHangDto) {
        List<KhachHang> khachHangs = khachHangRepository.findAll();
        Boolean isPhoneExisted = khachHangs.stream().anyMatch(kh -> kh.getSdt().equals(khachHangDto.getSdt()));
        if(isPhoneExisted){
            throw new RuntimeException("Số điện thoại đã tồn tại!");
        }
        Boolean isEmailExisted = khachHangs.stream().anyMatch(kh -> kh.getEmail().equals(khachHangDto.getEmail()));
        if(isEmailExisted){
            throw new RuntimeException("Email đã tồn tại!");
        }
        KhachHang khachHang = mapToEntity(khachHangDto);
        khachHang.setNguoiTao("system");
        String ma = "KH00";
        if(khachHangs.size() > 10){
            ma = "KH0";
        }
        if(khachHangs.size() > 100){
            ma = "KH";
        }
        khachHang.setMa(ma + (khachHangs.size() + 1));
        TaiKhoan taiKhoan = taiKhoanService.taoTKKhachHang(khachHangDto);
        khachHang.setTaiKhoan(taiKhoan);
        KhachHang kh = khachHangRepository.save(khachHang);
        List<DiaChi> diaChis  = new ArrayList<>();
        DiaChi diaChi;
        for(DiaChiDto diaChiDto : khachHangDto.getDiaChiDtos()){
            diaChi = new DiaChi();
            diaChi.setSoNha(diaChiDto.getSoNha());
            diaChi.setDuong(diaChiDto.getDuong());
            diaChi.setXa(diaChiDto.getXa());
            diaChi.setHuyen(diaChiDto.getHuyen());
            diaChi.setThanhPho(diaChiDto.getThanhPho());
            diaChi.setKhachHang(khachHang);
            diaChi.setTrangThai("Hoạt động");
            diaChi.setMacDinh(diaChiDto.getMacDinh());
            diaChis.add(diaChiRepository.save(diaChi));
        }

        kh.setDiaChis(diaChis);

        return mapToDto(kh);
    }

    // Tìm kiếm khách hàng theo tên hoặc số điện thoại (có thể nhập một phần)
    public List<KhachHang> timKiemKhachHang(String keyword) {
        List<KhachHang> khachHangs = khachHangRepository.findByTenKhachHangContainingIgnoreCaseOrSdtContainingIgnoreCase(keyword, keyword).stream()
                .filter(kh -> "Hoạt động".equalsIgnoreCase(kh.getTrangThai())) // Chặn "Tạm ngưng"
                .collect(Collectors.toList());

        // Loại bỏ trùng lặp trong danh sách DiaChi
        khachHangs.forEach(khachHang -> {
            List<DiaChi> diaChis = khachHang.getDiaChis().stream()
                    .distinct()  // Loại bỏ các địa chỉ trùng lặp
                    .collect(Collectors.toList());

            // Sắp xếp để địa chỉ mặc định lên trước
            diaChis.sort((diaChi1, diaChi2) -> diaChi2.getMacDinh().compareTo(diaChi1.getMacDinh()));

            khachHang.setDiaChis(diaChis);
        });

        return khachHangs;
    }

//    public List<KhachHang> timKiemKhachHang(String keyword) {
//        // Lấy danh sách khách hàng theo tên hoặc số điện thoại, lọc trạng thái "Hoạt động"
//        List<KhachHang> khachHangs = khachHangRepository.findByTenKhachHangContainingIgnoreCaseOrSdtContainingIgnoreCase(keyword, keyword).stream()
//                .filter(kh -> "Hoạt động".equalsIgnoreCase(kh.getTrangThai())) // Chặn "Tạm ngưng"
//                .collect(Collectors.toList());
//
//        // Loại bỏ trùng lặp trong danh sách địa chỉ và sắp xếp theo địa chỉ mặc định lên trước
//        khachHangs.forEach(khachHang -> {
//            List<DiaChi> diaChis = khachHang.getDiaChis().stream()
//                    .distinct()  // Loại bỏ các địa chỉ trùng lặp
//                    .collect(Collectors.toList());
//
//            // Sắp xếp địa chỉ mặc định lên trước
//            diaChis.sort((diaChi1, diaChi2) -> diaChi2.getMacDinh().compareTo(diaChi1.getMacDinh()));
//
//            khachHang.setDiaChis(diaChis);
//        });
//
//        // Sắp xếp khách hàng theo ngày tạo (ngayTao) mới nhất lên đầu tiên và khách hàng có ngày tạo là null được đặt cuối
//        return khachHangs.stream()
//                .sorted((kh1, kh2) -> {
//                    if (kh1.getNgayTao() == null && kh2.getNgayTao() == null) return 0; // Cả hai đều null, không thay đổi
//                    if (kh1.getNgayTao() == null) return 1; // Khách hàng kh1 có ngayTao null thì đặt sau kh2
//                    if (kh2.getNgayTao() == null) return -1; // Khách hàng kh2 có ngayTao null thì đặt sau kh1
//                    return kh2.getNgayTao().compareTo(kh1.getNgayTao()); // Sắp xếp theo ngày tạo giảm dần
//                })
//                .limit(5)  // Chỉ lấy 5 khách hàng mới nhất
//                .collect(Collectors.toList());
//    }
}
