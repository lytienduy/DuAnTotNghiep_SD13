package com.example.shopdragonbee.service.Client;


import com.example.shopdragonbee.config.VNPAYConfig;
import com.example.shopdragonbee.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.hibernate.sql.Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
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

//    public String createRefundRequest(HttpServletRequest request) {
//        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;//Bắt buộc phải nhân với 100L để cho VNPay hiểu
//        Map<String, String> vnpParamsMap = vnPayConfig.createRefundRequest(request.getParameter("maHoaDon"));
//        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
//        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
////        vnpParamsMap.put("vnp_IpAddr", "127.0.0.1");
////        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
//        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
////        queryUrl += "&vnp_SecureHash=" + VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);//Tạo mã giấu secretkey trong url
////        String url = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction?" + queryUrl;
//        vnpParamsMap.put("vnp_SecureHash", VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData));
//        RestTemplate restTemplate = new RestTemplate();
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(vnpParamsMap, headers);
//        ResponseEntity<Map> response = restTemplate.exchange(  "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction", HttpMethod.POST, requestEntity, Map.class);
//        // 4. Lấy vnp_ResponseCode để kiểm tra hoàn tiền có thành công không
//        String responseCode = (String) response.getBody().get("vnp_ResponseCode");
//        if ("00".equals(responseCode)) {
//            return "Hoàn tiền thành công!";
//        } else {
//            return "Hoàn tiền thất bại: " + responseCode;
//        }
//    }

}
