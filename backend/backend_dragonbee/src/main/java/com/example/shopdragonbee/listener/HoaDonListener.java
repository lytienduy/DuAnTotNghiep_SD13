package com.example.shopdragonbee.listener;

import com.example.shopdragonbee.entity.HoaDon;
import com.example.shopdragonbee.service.MailService;
import jakarta.persistence.PreUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class HoaDonListener {

    private static MailService mailServiceStatic;

    @Autowired
    public void setMailService(MailService mailService) {
        HoaDonListener.mailServiceStatic = mailService;
    }

    @PreUpdate
    public void onUpdate(HoaDon hoaDon) {
        // Chỉ gửi email nếu trạng thái khác "Chờ xác nhận"
        if (hoaDon.getEmailNguoiNhan() != null && hoaDon.getTrangThai() != null
                && !"Chờ xác nhận".equals(hoaDon.getTrangThai())) {

            String subject = "Cập nhật trạng thái đơn hàng #" + hoaDon.getMa();
            String body =
            "<html>" +
                    "<head>" +
                    "<style>" +
                    "body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                    "div.container { display: flex; justify-content: center;text-align: center; align-items: center; background-color: #f4f4f4; padding: 20px; }" +
                    "div.content { width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px; text-align: center; margin: 0 auto !important; }" + // Đảm bảo căn giữa với !important
                    "h2 { color: #3498ea; text-align: center; }" +
                    "h3 { color: #333333; text-align: center; }" +
                    "p { font-size: 16px; color: #555555; line-height: 1.6; text-align: center; }" +
                    ".discount-info { background-color: #f2f2f2; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; color: #333333; }" +
                    ".button { display: inline-block; background-color: #1976d2; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; text-align: center; }" +
                    ".button:hover { background-color: #1565c0; }" +  // Thêm hiệu ứng hover cho nút
                    ".button:focus { outline: none; }" +  // Loại bỏ outline khi nhấn vào nút
                    ".footer { text-align: center; font-size: 14px; color: #888888; margin-top: 20px; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>" +
                    "<div class='content'>" +
                    "<div><img src='https://raw.githubusercontent.com/lytienduy/DuAnTotNghiep_SD13/refs/heads/main/frontend/dragonbee/src/img/dragonbee_logo_v1.png' alt='Logo' style='max-width: 100px; height: auto;' /></div>" +
                    "<h3>Xin chào " + hoaDon.getTenNguoiNhan() + ",</h3>" +
                    "<p>Đơn hàng của bạn đã được cập nhật trạng thái mới: <strong>" + hoaDon.getTrangThai() + "</strong>.</p>" +
                    "<p>Mã đơn hàng: <strong>" + hoaDon.getMa() + "</strong></p>" +
                    "<p>Trân trọng,</p><p>DragonBeeShop</p>" +
                    "<a style='color:white' href='http://localhost:3000/home' class='button'>Xem Chi Tiết</a>" +
                    "<p class='footer'>Cảm ơn bạn đã ủng hộ chúng tôi!</p>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";
            mailServiceStatic.sendMail(hoaDon.getEmailNguoiNhan(), subject, body);
        }
    }

}
