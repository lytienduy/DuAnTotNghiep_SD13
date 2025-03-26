package com.example.shopdragonbee.service.Client;


import com.example.shopdragonbee.config.VNPAYConfig;
import com.example.shopdragonbee.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service

public class PaymentService {
    @Autowired
    private VNPAYConfig vnPayConfig;

    public String createVnPayPayment(HttpServletRequest request) {
        //
        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;//Bắt buộc phải nhân với 100L để cho VNPay hiểu
//        String bankCode = request.getParameter("bankCode");
        //
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig(request.getParameter("maHoaDon"));
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
//        if (bankCode != null && !bankCode.isEmpty()) {
//            vnpParamsMap.put("vnp_BankCode", bankCode);
//        }
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        //build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        queryUrl += "&vnp_SecureHash=" + VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);//Tạo mã giấu secretkey trong url
        return vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
    }
}
