package com.example.shopdragonbee.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {

    public byte[] generateQRCode(String data) throws Exception {
        // Thiết lập các thông số mã QR
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.MARGIN, 1);  // Giới hạn biên

        // Tạo mã QR từ dữ liệu
        BitMatrix bitMatrix = new MultiFormatWriter().encode(data, BarcodeFormat.QR_CODE, 200, 200, hints);

        // Chuyển BitMatrix thành ảnh
        BufferedImage image = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = image.createGraphics();

        // Vẽ nền trắng
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, 200, 200);

        // Vẽ các ô QR
        graphics.setColor(Color.BLACK);
        for (int i = 0; i < 200; i++) {
            for (int j = 0; j < 200; j++) {
                if (bitMatrix.get(i, j)) {
                    graphics.fillRect(i, j, 1, 1);  // Vẽ ô màu đen
                }
            }
        }

        // Chuyển BufferedImage thành mảng byte
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "PNG", baos);
        return baos.toByteArray();
    }
}
