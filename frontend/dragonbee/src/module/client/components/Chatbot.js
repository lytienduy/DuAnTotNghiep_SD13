import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, IconButton, Avatar, InputAdornment } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import iconAI from '../../../img/iconrobot.jpg';
import logo from '../../../img/dragonbee_logo_v1.png';
import SendIcon from "@mui/icons-material/Send";

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: `Dragonbeee xin chào quý khách ! chúng tôi có thể giúp gì cho bạn ?\n[Gợi ý]Quần âu bán chạy\n[Gợi ý]Quần âu mới về\n[Gợi ý]Chương trình khuyến mại`,
        },
    ]);
    const [input, setInput] = useState("");
    const [openChat, setOpenChat] = useState(false);
    const [isBotTyping, setIsBotTyping] = useState(false); // Trạng thái để kiểm tra bot có đang trả lời không

    const sendMessage = async (text = input) => {
        if (!text.trim()) return;

        const user = JSON.parse(localStorage.getItem("userKH"));
        const userId = user?.khachHang?.id ?? null;
        const finalMessage = `${text} userKH=${userId}`;

        const userMessage = { sender: "user", text };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Bắt đầu hiệu ứng dấu ba chấm khi bot đang trả lời
        setIsBotTyping(true);

        try {
            const response = await axios.post("http://localhost:8080/api/chatbot", { message: finalMessage });
            const botMessage = { sender: "bot", text: response.data.text || response.data };
            setMessages((prevMessages) => [...prevMessages, botMessage]);

            // Dừng hiệu ứng dấu ba chấm khi bot đã trả lời
            setIsBotTyping(false);
        } catch (error) {
            console.error("Error sending message", error);
            const errorMessage = { sender: "bot", text: "Bạn có thể mô tả chi tiết hơn được không." };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);

            // Dừng hiệu ứng dấu ba chấm khi xảy ra lỗi
            setIsBotTyping(false);
        }
        setInput("");
    };

    // Hàm tạo hiệu ứng ba dấu chấm
    const renderBotTypingEffect = () => {
        return (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, marginLeft: 3 }}>
                <Box sx={{
    display: "flex",
    alignItems: "center", // Căn giữa theo chiều dọc
    justifyContent: "center", // Căn giữa theo chiều ngang
    padding: "8px",  // Khoảng đệm trong box bao quanh dấu chấm
    backgroundColor: "#f0f0f0",  // Màu nền xám cho box
    borderRadius: "8px",  // Bo góc cho box
    border: "1px solid #d0d0d0",  // Đường viền xung quanh box
    marginRight: "4px",  // Khoảng cách giữa các dấu chấm
    height: 5 // Đảm bảo chiều cao box đủ lớn để căn giữa
}}>
    <Typography sx={{
        fontSize: 24,
        color: "gray",
        animation: "typingEffect 1.5s infinite",
        animationDelay: "0s", // Delay cho dấu chấm đầu tiên
        marginBottom:1.7
    }}>
        .
    </Typography>

    <Typography sx={{
        fontSize: 24,
        color: "gray",
        animation: "typingEffect 1.5s infinite",
        animationDelay: "0.3s", // Delay cho dấu chấm thứ hai
        marginBottom:1.7
    }}>
        .
    </Typography>

    <Typography sx={{
        fontSize: 24,
        color: "gray",
        animation: "typingEffect 1.5s infinite",
        animationDelay: "0.6s", // Delay cho dấu chấm thứ ba
        marginBottom:1.7
    }}>
        .
    </Typography>
</Box>

            </Box>
        );
    };

    return (
        <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
            {/* Chat Icon */}
            {!openChat && (
                <Box
                    onClick={() => setOpenChat(true)}
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: 3,
                        backgroundColor: 'white',
                        "&:hover": {
                            backgroundColor: "#f1f1f1"
                        }
                    }}
                >
                    <img
                        src={iconAI}
                        alt="Chatbot Icon"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </Box>
            )}

            {/* Chat Box */}
            {openChat && (
                <Paper elevation={3} sx={{
                    maxWidth: 350, position: "fixed", bottom: 0, right: 0,
                    borderTopLeftRadius: "15px", borderTopRightRadius: "15px",
                    borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", backgroundColor: "#f0f0f0"
                }}>
                    {/* Header */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                        backgroundColor: "#1976d2",
                        padding: "8px",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar src={logo} sx={{ mr: 1 }} />
                            <Typography sx={{ fontWeight: "bold", color: "white", fontSize: 15 }}>Hỗ trợ 24/7</Typography>
                        </Box>
                        <IconButton onClick={() => setOpenChat(false)} sx={{ color: "white" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Chat Content */}
                    <Box sx={{ height: 300, overflowY: "auto", mb: 2, p: 1, backgroundColor: "#f0f0f0", borderRadius: "10px" }}>
                        {messages.map((msg, index) => {
                            const isBot = msg.sender === "bot";
                            const lines = msg.text.split("\n");

                            return (
                                <Box key={index} sx={{
                                    display: "flex", flexDirection: isBot ? "row" : "row-reverse", mb: 1
                                }}>
                                    {isBot && <Avatar src={logo} sx={{ width: 30, height: 30, mr: 1 }} />}
                                    <Box>
                                        {lines.map((line, idx) => {
                                            if (line.startsWith("[SP]")) {
                                                const [name, price, img, id] = line.substring(4).split("|");
                                                return (
                                                    <Paper key={idx} elevation={2} sx={{ p: 1, m: 0.5, display: "flex", alignItems: "center" }}>
                                                        <img src={img} alt={name} style={{ width: 60, height: 60, marginRight: 8, objectFit: "cover", borderRadius: 8 }} />
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{name}</Typography>
                                                            <Typography variant="body2" color="text.secondary">{Number(price).toLocaleString()}₫</Typography>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => window.open(`http://localhost:3000/sanPhamChiTiet/${id}`, "_blank")}
                                                                sx={{ mt: 1 }}
                                                            >
                                                                Xem chi tiết
                                                            </Button>
                                                        </Box>
                                                    </Paper>
                                                );
                                            }

                                            // Display suggestions
                                            if (line.startsWith("[Gợi ý]")) {
                                                const suggestion = line.replace("[Gợi ý]", "").trim();
                                                return (
                                                    <Button
                                                        key={idx}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ m: 0.5 }}
                                                        onClick={() => sendMessage(suggestion)}
                                                    >
                                                        {suggestion}
                                                    </Button>
                                                );
                                            }

                                            // Display promotional messages
                                            if (line.startsWith("[KM]")) {
                                                const [ma, giatri, dieuKien] = line.substring(4).split("|");
                                                return (
                                                    <Paper key={idx} elevation={2} sx={{ p: 1, m: 0.5, backgroundColor: "#e1f5fe" }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>🎁 {ma}</Typography>
                                                        <Typography variant="body2">{giatri}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{dieuKien}</Typography>
                                                    </Paper>
                                                );
                                            }

                                            // Normal messages
                                            return (
                                                <Typography key={idx} sx={{
                                                    backgroundColor: isBot ? "white" : "#cce5ff",
                                                    padding: "8px 12px", borderRadius: "10px", maxWidth: "70%", color: "black", mb: 0.5
                                                }}>
                                                    {line}
                                                </Typography>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            );
                        })}

                        {/* Hiệu ứng ba dấu chấm khi bot đang trả lời */}
                        {isBotTyping && renderBotTypingEffect()}
                    </Box>

                    {/* Input box */}
                    <Box sx={{ px: 2, pb: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={input}
                            size="small"
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Nhập tin nhắn..."
                            sx={{ backgroundColor: "white", borderRadius: "5px" }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={sendMessage} color="primary">
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default Chatbot;
