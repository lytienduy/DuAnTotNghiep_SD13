package com.example.shopdragonbee.service;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class UsernameGenerator {
    public static String generateUsername(String fullName, String maNhanVien) {
        fullName = removeDiacritics(fullName.trim().toLowerCase()); // Loại bỏ dấu, chuyển chữ thường
        String[] parts = fullName.split("\\s+"); // Tách các từ trong tên

        if (parts.length < 2) {
            throw new IllegalArgumentException("Tên không hợp lệ");
        }

        String lastName = parts[parts.length - 1]; // Lấy tên cuối
        StringBuilder initials = new StringBuilder();

        for (int i = 0; i < parts.length - 1; i++) {
            initials.append(parts[i].charAt(0)); // Lấy chữ cái đầu mỗi từ
        }

        // Chuẩn hóa mã nhân viên: chỉ lấy số, thêm "nv" phía trước
        String maNV = "nv" + maNhanVien.replaceAll("[^0-9]", "");

        return lastName + initials.toString() + maNV;
    }

    private static String removeDiacritics(String str) {
        String normalized = Normalizer.normalize(str, Normalizer.Form.NFD);
        return Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(normalized).replaceAll("").replace("đ", "d");
    }
}
