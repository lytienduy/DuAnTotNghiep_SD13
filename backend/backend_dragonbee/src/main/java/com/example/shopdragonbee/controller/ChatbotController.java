package com.example.shopdragonbee.controller;

import com.example.shopdragonbee.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {
    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody Map<String, String> request) throws IOException {
        String userMessage = request.get("message");

        // Kiểm tra nếu là một yêu cầu liên quan đến các sản phẩm khác ngoài quần âu
        if (isOtherProductRequest(userMessage)) {
            String apologyMessage = getApologyMessage();
            return ResponseEntity.ok(apologyMessage);
        }

        // Kiểm tra nếu là lời cảm ơn
        if (isThankYouMessage(userMessage)) {
            String thankReply = getRandomThankReply();
            return ResponseEntity.ok(thankReply);
        }

        // Xử lý các message thông thường khác
        String botResponse = chatbotService.chatWithBot(userMessage);
        return ResponseEntity.ok(botResponse);
    }

    private boolean isThankYouMessage(String message) {
        if (message == null) return false;
        String lower = message.toLowerCase();
        return lower.contains("cảm ơn") || lower.contains("thank") || lower.contains("thanks");
    }

    private boolean isOtherProductRequest(String message) {
        if (message == null) return false;
        String lower = message.toLowerCase();
        // Danh sách các sản phẩm không phải quần âu
        String[] nonPantsProducts = {"túi sách", "áo", "váy", "sơ mi", "kính", "giày"};
        for (String product : nonPantsProducts) {
            if (lower.contains(product)) {
                return true;
            }
        }
        return false;
    }

    private String getApologyMessage() {
        return "Xin lỗi vì sự bất tiện này, hiện tại DragonBee chỉ kinh doanh về quần âu 👖. " +
                "DragonBee xin tiếp nhận mong muốn của bạn, rất có thể trong tương DragonBee tôi sẽ kinh doanh về sản phẩm bạn mong muốn 🍀. " +
                "Rất mong bạn sẽ tiếp tục ủng hộ chúng mình 🐝.";
    }

    private String getRandomThankReply() {
        String[] thankReplies = {
                "Dragonbee rất vui vì đã giúp được bạn ❤️",
                "Cảm ơn bạn đã tin tưởng Dragonbee 🐝",
                "Luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào 💬",
                "Rất hân hạnh được đồng hành cùng bạn ✨"
        };
        return thankReplies[new Random().nextInt(thankReplies.length)];
    }
}
