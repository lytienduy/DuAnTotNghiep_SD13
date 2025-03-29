package com.example.shopdragonbee.service;
import org.springframework.scheduling.annotation.Async;
import com.example.shopdragonbee.entity.PhieuGiamGia;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.text.DecimalFormat;



@Service
public class EmailPGGService {
    // Định dạng số để có dấu phân cách hàng nghìn và không có phần thập phân
    DecimalFormat df = new DecimalFormat("#,###");

    private final JavaMailSender mailSender;

    public EmailPGGService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendDiscountNotification(List<String> emailAddresses, PhieuGiamGia phieuGiamGia) {
        String loaiPhieuGiamGia = phieuGiamGia.getLoaiPhieuGiamGia();
        String donVi = "";
        if ("Cố định".equalsIgnoreCase(loaiPhieuGiamGia)) {
            donVi = "VNĐ";  // Nếu là "Cố định", trả về "VNĐ"
        } else if ("Phần trăm".equalsIgnoreCase(loaiPhieuGiamGia)) {
            donVi = "%";  // Nếu là "Phần trăm", trả về "%"
        }
        String discountCode = phieuGiamGia.getTenPhieuGiamGia(); // Tên phiếu giảm giá
        String discountValue = df.format(phieuGiamGia.getGiaTriGiam()) + " " + donVi; // Giá trị giảm + kiểu giảm
        String validFrom = phieuGiamGia.getNgayBatDau().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")); // Định dạng thời gian
        String validUntil = phieuGiamGia.getNgayKetThuc().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")); // Định dạng thời gian

        for (String email : emailAddresses) {
            try {

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                // Thiết lập người nhận và tiêu đề
                helper.setTo(email);
                helper.setSubject("Thông Báo Phiếu Giảm Giá");

                // Tạo nội dung email dạng HTML
                String htmlContent = "<html>" +
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
                        "<h2>Bạn có một phiếu giảm giá đặc biệt: " + discountCode + "</h2>" +
                        "<h3>Thông Báo Phiếu Giảm Giá</h3>" +
                        "<p>Xin chào quý khách hàng thân yêu,</p>" +
                        "<p>Chúng tôi vui mừng thông báo rằng bạn có một phiếu giảm giá đặc biệt.</p>" +
                        "<div class='discount-info'>" +
                        "<strong style='color:red'>Giảm " + discountValue + "</strong><br>" +
                        "Có hiệu lực từ: " + validFrom + "<br>" +
                        "Đến ngày: " + validUntil +
                        "</div>" +
                        "<p>Hãy sử dụng phiếu giảm giá này khi bạn mua sắm trên trang web của chúng tôi để nhận được ưu đãi đặc biệt.</p>" +
                        "<a style='color:white' href='http://localhost:3000/home' class='button'>Xem Chi Tiết</a>" +
                        "<p class='footer'>Cảm ơn bạn đã ủng hộ chúng tôi!</p>" +
                        "</div>" +
                        "</div>" +
                        "</body>" +
                        "</html>";

                // Đặt nội dung email
                helper.setText(htmlContent, true);

                // Gửi email
                mailSender.send(message);

            } catch (MailException | jakarta.mail.MessagingException e) {
                e.printStackTrace();
            }
        }
    }

    @Async
    public void sendDiscountSuspendedNotification(List<String> emailAddresses, PhieuGiamGia phieuGiamGia) {
        for (String email : emailAddresses) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setTo(email);
                helper.setSubject("Thông Báo Phiếu Giảm Giá Tạm Dừng");

                String discountName = phieuGiamGia.getTenPhieuGiamGia();  // Lấy tên phiếu giảm giá
                String htmlContent =
                "<html>" +
                        "<head>" +
                        "<style>" +
                        "body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                        "div.container { display: flex; justify-content: center;text-align: center; align-items: center; background-color: #f4f4f4; padding: 20px; }" +
                        "div.content { width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px; text-align: center; margin: 0 auto !important; }" + // Đảm bảo căn giữa với !important
                        "h2 { color: #3498ea; text-align: center; }" +
                        "h3 { color: #333333; text-align: center; }" +
                        "p { font-size: 16px; color: #555555; line-height: 1.6; text-align: center; }" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class='container'>" +
                        "<div class='content'>" +
                        "<div><img src='https://raw.githubusercontent.com/lytienduy/DuAnTotNghiep_SD13/refs/heads/main/frontend/dragonbee/src/img/dragonbee_logo_v1.png' alt='Logo' style='max-width: 100px; height: auto;' /></div>" +
                        "<h2>Phiếu Giảm Giá " + discountName + " Của Bạn Đã Tạm Dừng</h2>" +
                        "<h3>Thông Báo Phiếu Giảm Giá</h3>" +
                        "<p>Xin chào quý khách hàng thân yêu,</p>" +
                        "<p>Rất tiếc, phiếu giảm giá <strong>" + discountName + "</strong> của bạn đã bị tạm dừng do một số lý do.</p>" +
                        "</div>" +
                        "</div>" +
                        "</body>" +
                        "</html>";

                helper.setText(htmlContent, true);
                mailSender.send(message);
            } catch (MailException | jakarta.mail.MessagingException e) {
                e.printStackTrace();
            }
        }
    }

    @Async
    public void sendDiscountResumedNotification(List<String> emailAddresses, PhieuGiamGia phieuGiamGia) {
        for (String email : emailAddresses) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setTo(email);
                helper.setSubject("Thông Báo Phiếu Giảm Giá Hoạt Động Trở Lại");

                String discountName = phieuGiamGia.getTenPhieuGiamGia();  // Lấy tên phiếu giảm giá
                String htmlContent =
                "<html>" +
                        "<head>" +
                        "<style>" +
                        "body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                        "div.container { display: flex; justify-content: center;text-align: center; align-items: center; background-color: #f4f4f4; padding: 20px; }" +
                        "div.content { width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px; text-align: center; margin: 0 auto !important; }" + // Đảm bảo căn giữa với !important
                        "h2 { color: #3498ea; text-align: center; }" +
                        "h3 { color: #333333; text-align: center; }" +
                        "p { font-size: 16px; color: #555555; line-height: 1.6; text-align: center; }" +
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
                        "<h2>Phiếu Giảm Giá " + discountName + " Của Bạn Đã Hoạt Động Trở Lại</h2>" +
                        "<h3>Thông Báo Phiếu Giảm Giá</h3>" +
                        "<p>Xin chào quý khách hàng thân yêu,</p>" +
                        "<p>Chúng tôi xin thông báo rằng phiếu giảm giá <strong>" + discountName + "</strong> của bạn đã hoạt động trở lại. Xin lỗi vì sự bất tiện này.</p>" +
                        "<p>Hãy sử dụng phiếu giảm giá này khi bạn mua sắm trên trang web của chúng tôi để nhận được ưu đãi đặc biệt.</p>" +
                        "<a style='color:white' href='http://localhost:3000/home' class='button'>Xem Chi Tiết</a>" +
                        "<p class='footer'>Cảm ơn bạn đã ủng hộ chúng tôi!</p>" +
                        "</div>" +
                        "</div>" +
                        "</body>" +
                        "</html>";

                helper.setText(htmlContent, true);
                mailSender.send(message);
            } catch (MailException | jakarta.mail.MessagingException e) {
                e.printStackTrace();
            }
        }
    }

}
