import React, { useState, useEffect, useRef } from "react";
import {
    Box, Paper, Typography, TextField, IconButton,
    Avatar, InputAdornment
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import logo from "../../../img/dragonbee_logo_v1.png";
import ImageIcon from "@mui/icons-material/Image"; // import icon ảnh

const ChatMessenger = () => {
    const [openChat, setOpenChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const stompClient = useRef(null);
    const scrollRef = useRef(null);
    const bottomRef = useRef(null);

    const userKH = JSON.parse(localStorage.getItem("userKH"));

    // Kết nối WebSocket
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userKH"));
        if (!storedUser) return;

        const socket = new SockJS("http://localhost:8080/chat");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe("/topic/messages", (msg) => {
                    const message = JSON.parse(msg.body);
                    setMessages(prev => [...prev, message]);
                });
            }
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, []); // 👈 chạy 1 lần duy nhất khi component mount

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userKH"));
        if (!storedUser) return;

        fetch(`http://localhost:8080/api/chat/messages/${storedUser.khachHang.id}`)
            .then(res => res.json())
            .then(data => setMessages(data))
            .catch(console.error);
    }, []); // 👈 gọi 1 lần duy nhất

    // Cuộn xuống cuối mỗi khi có tin nhắn mới
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim() || !userKH || !stompClient.current?.connected) return;

        const messageObj = {
            noiDung: newMessage,
            guiTuNhanVien: false,
            idKhachHang: userKH.khachHang.id,
            thoiGian: new Date().toISOString(),
        };

        stompClient.current.publish({
            destination: "/app/chat/send",
            body: JSON.stringify(messageObj)
        });

        setNewMessage("");
    };

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    useEffect(() => {
        if (openChat && bottomRef.current) {
            // Delay 1 chút để khung chat hiển thị xong rồi mới cuộn
            setTimeout(() => {
                bottomRef.current.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [openChat]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !userKH || !stompClient.current?.connected) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8080/api/chat/upload", {
                method: "POST",
                body: formData,
            });

            const imageRes = await res.json(); // 🟢 Lấy object { url: "..." }
            const html = `<img src="${imageRes.url}" alt="uploaded" style="max-width: 200px; border-radius: 8px;" />`;

            const messageObj = {
                noiDung: html,
                guiTuNhanVien: false,
                idKhachHang: userKH.khachHang.id,
                thoiGian: new Date().toISOString(),
            };

            stompClient.current.publish({
                destination: "/app/chat/send",
                body: JSON.stringify(messageObj),
            });
        } catch (err) {
            console.error("Lỗi upload ảnh:", err);
        }
    };

    return (
        <Box sx={{ position: "fixed", bottom: 90, right: 20, zIndex: openChat ? 1300 : 1000 }}>
            {/* Nút mở chat */}
            {!openChat && (
                <Box
                    onClick={() => setOpenChat(true)}
                    sx={{
                        width: 50, height: 50, borderRadius: "50%", overflow: "hidden",
                        cursor: "pointer", boxShadow: 3, backgroundColor: "white",
                        "&:hover": { backgroundColor: "#f1f1f1" }
                    }}
                >
                    <img src={logo} alt="Chat Icon" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
            )}

            {/* Hộp chat */}
            {openChat && (
                <Paper elevation={3} sx={{
                    width: 350, position: "fixed", bottom: 0, right: 0,
                    borderTopLeftRadius: "15px", borderTopRightRadius: "15px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", backgroundColor: "#f0f0f0"
                }}>
                    {/* Header */}
                    <Box sx={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        backgroundColor: "#1976d2", padding: "8px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar src={logo} sx={{ mr: 1 }} />
                            <Typography sx={{ fontWeight: "bold", color: "white", fontSize: 15 }}>
                                Nhân viên hỗ trợ
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setOpenChat(false)} sx={{ color: "white" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Nội dung chat */}
                    <Box ref={scrollRef} sx={{ height: 330, overflowY: "auto", p: 1 }}>
                        {messages.map((msg, index) => {
                            const isBot = msg.guiTuNhanVien;
                            return (
                                <Box key={index} sx={{
                                    display: "flex",
                                    flexDirection: isBot ? "row" : "row-reverse",
                                    mb: 1
                                }}>
                                    {isBot && <Avatar src={logo} sx={{ width: 30, height: 30, mr: 1 }} />}
                                    <Box>
                                        {
                                            msg.noiDung.includes("<img")
                                                ? (
                                                    <Box
                                                        dangerouslySetInnerHTML={{
                                                            __html: msg.noiDung.replace(
                                                                /<img[^>]+src="([^"]+)"[^>]*>/g,
                                                                (match, src) =>
                                                                    `<img src="${src}" alt="uploaded" style="max-width: 200px; border-radius: 8px; cursor: pointer;" onclick="window.dispatchEvent(new CustomEvent('preview-image', { detail: '${src}' }))" />`
                                                            )
                                                        }}
                                                    />
                                                )
                                                : (
                                                    <Box
                                                        sx={{
                                                            backgroundColor: isBot ? "white" : "#cce5ff",
                                                            padding: "8px 12px",
                                                            borderRadius: "10px",
                                                            maxWidth: "70%",
                                                            width: "fit-content",
                                                            color: "black",
                                                            wordBreak: 'break-word',
                                                            whiteSpace: 'pre-wrap',
                                                            mr: isBot ? 0 : 0,
                                                            ml: isBot ? 0 : 'auto'
                                                        }}
                                                    >
                                                        {msg.noiDung}
                                                    </Box>
                                                )
                                        }

                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{
                                                mt: 0.5,
                                                display: 'block',
                                                textAlign: msg.guiTuNhanVien ? 'left' : 'right'  // 👈 căn trái cho nhân viên, phải cho khách hàng
                                            }}
                                        >
                                            {new Date(msg.thoiGian).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {msg.guiTuNhanVien && msg.tenNhanVien ? ` - Nhân viên ${msg.tenNhanVien}` : ''}
                                        </Typography>

                                    </Box>
                                </Box>
                            );
                        })}
                        <div ref={bottomRef} />
                    </Box>

                    {/* Nhập tin nhắn */}
                    <Box sx={{ px: 2, pb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton component="label">
                                <ImageIcon />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e)}
                                />
                            </IconButton>

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Nhập tin nhắn..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                sx={{ backgroundColor: "white", borderRadius: "5px" }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton color="primary" onClick={handleSend}>
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default ChatMessenger;
