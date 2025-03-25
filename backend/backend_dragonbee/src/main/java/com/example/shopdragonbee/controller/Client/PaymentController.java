package com.example.shopdragonbee.controller.Client;

import com.example.shopdragonbee.config.VNPAYConfig;
import com.example.shopdragonbee.service.Client.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/vn-pay")
    public String pay(HttpServletRequest request) {
        return paymentService.createVnPayPayment(request);
    }

    @GetMapping("/vn-pay-callback")
    public ResponseEntity<String> payCallbackHandler(@RequestParam Map<String, String> params) {
        String responseCode = params.get("vnp_ResponseCode");

        if ("00".equals(responseCode)) {
            // Thanh toán thành công -> Trả về trang thanh toán React
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:3000/thanhToan?" + params.entrySet().stream()
                    .map(e -> e.getKey() + "=" + e.getValue())
                    .collect(Collectors.joining("&")))).build();
        } else {
            // Thanh toán thất bại -> Trả về giỏ hàng React
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:3000/gioHang")).build();
        }
    }
}
