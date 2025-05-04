package com.example.shopdragonbee.controller.Client;

import com.example.shopdragonbee.config.VNPAYConfig;
import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.entity.PhuongThucThanhToan;
import com.example.shopdragonbee.entity.ThanhToanHoaDon;
import com.example.shopdragonbee.repository.HoaDonRepository;
import com.example.shopdragonbee.repository.PhuongThucThanhToanRepository;
import com.example.shopdragonbee.repository.ThanhToanHoaDonRepository;
import com.example.shopdragonbee.service.Client.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private PhuongThucThanhToanRepository phuongThucThanhToanRepository;

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private ThanhToanHoaDonRepository thanhToanHoaDonRepository;

    @GetMapping("/vn-pay")
    public String pay(HttpServletRequest request) {
        return paymentService.createVnPayPayment(request);
    }

    @GetMapping("/vn-pay-callback")
    public Integer payCallbackHandler(@RequestParam Map<String, String> params) {
        try {
            String vnp_ResponseCode = params.get("vnp_ResponseCode");
            String vnp_TxnRef = params.get("vnp_TxnRef");
            String vnp_Amount = params.get("vnp_Amount");
            String vnp_PayDate = params.get("vnp_PayDate");
            if ("00".equals(vnp_ResponseCode)) {
                HoaDon hoaDon = new HoaDon();
                hoaDon.setMa(vnp_TxnRef);
                hoaDon.setTrangThai("Đã thanh toán");
                hoaDon.setNgayTao(LocalDateTime.now());//Set ngày tạo
                hoaDonRepository.save(hoaDon);
                ThanhToanHoaDon thanhToanHoaDon = new ThanhToanHoaDon();
                thanhToanHoaDon.setMa("TTHD" + (System.currentTimeMillis() % 100000));
                thanhToanHoaDon.setHoaDon(hoaDonRepository.findHoaDonByMa(vnp_TxnRef));
                thanhToanHoaDon.setPhuongThucThanhToan(phuongThucThanhToanRepository.findById(3).get());
                thanhToanHoaDon.setSoTienThanhToan(Float.parseFloat(vnp_Amount) / 100);
                //Chuyển định dạng date thanh toán thành công sang localdatetime để lưu vào database
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
                // Chuyển đổi sang LocalDateTime
                LocalDateTime localDateTime = LocalDateTime.parse(vnp_PayDate, formatter);
                thanhToanHoaDon.setNgayTao(localDateTime);
                thanhToanHoaDon.setLoai("Thanh toán");
                thanhToanHoaDonRepository.save(thanhToanHoaDon);
                return hoaDon.getId();
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @GetMapping("/check-status")
    public String checkPaymentStatus(@RequestParam String maHoaDon) {
        HoaDon hoaDon = hoaDonRepository.findHoaDonByMa(maHoaDon);
        if (hoaDon == null) {
            return null;
        }
        return hoaDon.getTrangThai();
    }

//    @GetMapping("/refund")
//    public String refundTransaction(HttpServletRequest request) {
//        return paymentService.createRefundRequest(request);
//    }

}
