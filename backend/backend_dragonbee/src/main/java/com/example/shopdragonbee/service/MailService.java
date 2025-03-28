package com.example.shopdragonbee.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.springframework.scheduling.annotation.Async;

@Service
public class MailService {
    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendMail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // HTML
            mailSender.send(message);
            System.out.println("✅ Email gửi thành công tới: " + to);
        } catch (MessagingException e) {
            System.err.println("❌ Gửi email lỗi:");
            e.printStackTrace();
        }
    }
}

