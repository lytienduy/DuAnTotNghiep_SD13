package com.example.shopdragonbee.config;

import com.example.shopdragonbee.repository.HoaDonRepository;
import com.example.shopdragonbee.repository.ThanhToanHoaDonRepository;
import com.example.shopdragonbee.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.text.SimpleDateFormat;
import java.util.*;

@Configuration
@Getter
public class VNPAYConfig {
    @Autowired
    ThanhToanHoaDonRepository thanhToanHoaDonRepository;
    @Value("${PAY_URL}")
    private String vnp_PayUrl;
    @Value("${RETURN_URL}")
    private String vnp_ReturnUrl;
    @Value("${TMN_CODE}")
    private String vnp_TmnCode;
    @Value("${SECRET_KEY}")
    private String secretKey;
    @Value("${VERSION}")
    private String vnp_Version;
    @Value("${COMMAND}")
    private String vnp_Command;
    @Value("${ORDER_TYPE}")
    private String orderType;

    public Map<String, String> getVNPayConfig(String maHoaDon) {
        //Trả về map là các tham số cho url để thanh toán vnpay
        Map<String, String> vnpParamsMap = new HashMap<>();
        vnpParamsMap.put("vnp_Version", this.vnp_Version);
        vnpParamsMap.put("vnp_Command", this.vnp_Command);
        vnpParamsMap.put("vnp_TmnCode", this.vnp_TmnCode);
        vnpParamsMap.put("vnp_CurrCode", "VND");
        vnpParamsMap.put("vnp_TxnRef", maHoaDon);
        vnpParamsMap.put("vnp_OrderInfo", "Thanh toan don hang:" + maHoaDon);
        vnpParamsMap.put("vnp_OrderType", this.orderType);
        vnpParamsMap.put("vnp_Locale", "vn");
        vnpParamsMap.put("vnp_ReturnUrl", this.vnp_ReturnUrl);
        //Truyền tham số ngày tạo
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(calendar.getTime());
        vnpParamsMap.put("vnp_CreateDate", vnpCreateDate);
        //Truyền tham số thời gian hết hạn
        calendar.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(calendar.getTime());
        vnpParamsMap.put("vnp_ExpireDate", vnp_ExpireDate);
        return vnpParamsMap;
    }

    public Map<String, String> createRefundRequest(String maHoaDon) {
        Map<String, String> vnpParamsMap = new HashMap<>();
        vnpParamsMap.put("vnp_Version", this.vnp_Version);
        vnpParamsMap.put("vnp_Command", "refund");
        vnpParamsMap.put("vnp_TmnCode", this.vnp_TmnCode);
        vnpParamsMap.put("vnp_TransactionType", "02");  // 02: Hoàn tiền một phần
        vnpParamsMap.put("vnp_TxnRef", maHoaDon);
        vnpParamsMap.put("vnp_OrderInfo", "Hoan tien don hang #" + maHoaDon);
        vnpParamsMap.put("vnp_TransDate", "20250330115944"); // Thời gian giao dịch gốc (YYYYMMDDhhmmss)
        vnpParamsMap.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
        return vnpParamsMap;
    }
}
