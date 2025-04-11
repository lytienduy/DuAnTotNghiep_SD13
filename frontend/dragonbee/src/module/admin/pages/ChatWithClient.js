import React, { useState, useEffect, useRef } from 'react';
import {
    Box, List, ListItem, ListItemText,
    Typography, TextField, Paper, Divider, Avatar,
    InputAdornment, IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from "@mui/icons-material/Image";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatWithClient = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const selectedClientRef = useRef(null);
    const stompClientRef = useRef(null);
    const scrollRef = useRef(null);
    const bottomRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/chat/clients')
            .then(res => res.json())
            .then(data => {
                const withFallbackTime = data.map(client => ({
                    ...client,
                    lastMessageTime: client.lastMessageTime || 0,
                    unread: false
                }));
                const sorted = withFallbackTime.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
                setClients(sorted);
            });
            
    }, []);

    // Tạo màu từ chuỗi (ổn định theo tên)
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = '#' + ((hash >> 24) & 0xff).toString(16).padStart(2, '0') +
            ((hash >> 16) & 0xff).toString(16).padStart(2, '0') +
            ((hash >> 8) & 0xff).toString(16).padStart(2, '0');
        return color.slice(0, 7); // chỉ lấy 6 ký tự màu hex
    };

    const getInitials = (name) => {
        if (!name) return '';
        const words = name.trim().split(' ');
        if (words.length === 1) return words[0][0].toUpperCase();
        const first = words[0][0].toUpperCase();
        const last = words[words.length - 1][0].toUpperCase();
        return first + last;
    };

    useEffect(() => {
        selectedClientRef.current = selectedClient;

        if (selectedClient) {
            fetch(`http://localhost:8080/api/chat/messages/${selectedClient.id}`)
                .then(res => res.json())
                .then(data => setMessages(data));
        }
    }, [selectedClient]);


    // ✅ Khởi tạo STOMP WebSocket khi component mount
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/chat');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ Đã kết nối WebSocket");

                stompClient.subscribe('/topic/messages', (message) => {
                    const newMsg = JSON.parse(message.body);

                    // Nếu là tin nhắn từ khách hàng đang chọn
                    if (selectedClientRef.current && newMsg.idKhachHang === selectedClientRef.current.id) {
                        setMessages(prev => [...prev, newMsg]);
                    }

                    setClients(prevClients => {
                        const updatedClients = prevClients.map(client => {
                            if (client.id === newMsg.idKhachHang) {
                                return {
                                    ...client,
                                    lastMessage: newMsg.noiDung, // Cập nhật nội dung cuối
                                    lastMessageTime: Date.now(),
                                    unread: !(selectedClientRef.current && newMsg.idKhachHang === selectedClientRef.current.id)
                                };
                            }
                            return client;
                        });

                        return updatedClients.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
                    });
                });
            }
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, []); // ❗ Chỉ chạy một lần duy nhất    

    const handleSelectClient = (client) => {
        setSelectedClient(client);

        setClients(prevClients => prevClients.map(c =>
            c.id === client.id ? { ...c, unread: false } : c
        ));
    };

    const handleSend = () => {
        if (!newMessage.trim() || !selectedClient) return;

        const userData = JSON.parse(localStorage.getItem('userData'));

        const messageObj = {
            guiTuNhanVien: true,
            idNhanVien: userData?.nhanVien?.id,
            tenNhanVien: userData?.nhanVien?.tenNhanVien, // ✅ thêm dòng này
            idKhachHang: selectedClient.id,
            noiDung: newMessage,
            thoiGian: new Date().toISOString(),
        };

        // ✅ Chỉ gửi, không thêm vào messages ở đây
        stompClientRef.current.publish({
            destination: '/app/chat/send',
            body: JSON.stringify(messageObj)
        });

        setNewMessage('');
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length || !selectedClient) return;

        // Giới hạn 10 ảnh
        const limitedFiles = files.slice(0, 10);

        for (const file of limitedFiles) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('http://localhost:8080/api/chat/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();

                const userData = JSON.parse(localStorage.getItem('userData'));
                const messageObj = {
                    guiTuNhanVien: true,
                    idNhanVien: userData?.nhanVien?.id,
                    tenNhanVien: userData?.nhanVien?.tenNhanVien,
                    idKhachHang: selectedClient.id,
                    noiDung: `<img src="${data.url}" alt="uploaded" style="max-width: 200px; border-radius: 8px;" />`,
                    thoiGian: new Date().toISOString(),
                };

                stompClientRef.current.publish({
                    destination: '/app/chat/send',
                    body: JSON.stringify(messageObj),
                });
            } catch (err) {
                console.error("Upload ảnh lỗi:", err);
            }
        }

        // Clear input để lần sau chọn ảnh giống vẫn được
        e.target.value = null;
    };

    // Cuộn xuống cuối mỗi khi có tin nhắn mới
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
            if (selectedClient && bottomRef.current) {
                // Delay 1 chút để khung chat hiển thị xong rồi mới cuộn
                setTimeout(() => {
                    bottomRef.current.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }, [selectedClient]);

    useEffect(() => {
        const handlePreviewImage = (e) => {
            setPreviewImage(e.detail);
        };

        window.addEventListener("preview-image", handlePreviewImage);
        return () => window.removeEventListener("preview-image", handlePreviewImage);
    }, []);

    // useEffect(() => {
    //     // Fake danh sách khách hàng để test
    //     const fakeClients = [
    //         { id: 1, tenKhachHang: 'Tạ Thị Hoa' },
    //         { id: 2, tenKhachHang: 'Nguyễn Văn An' },
    //         { id: 3, tenKhachHang: 'Lê Thị Bích' },
    //         { id: 4, tenKhachHang: 'Trần Minh Tuấn' },
    //         { id: 5, tenKhachHang: 'Phạm Thị Lan' },
    //         { id: 6, tenKhachHang: 'Đỗ Đức Huy' },
    //         { id: 7, tenKhachHang: 'Vũ Thị Mai' },
    //         { id: 8, tenKhachHang: 'Ngô Văn Phúc' },
    //         { id: 9, tenKhachHang: 'Bùi Thị Kim' },
    //         { id: 10, tenKhachHang: 'Hoàng Văn Nam' },
    //     ];

    //     setClients(fakeClients);
    // }, []);

    return (
        <Box display="flex" height="80vh" gap={2}>
            {/* Danh sách khách hàng */}
            <Paper sx={{ width: '25%', overflow: 'auto', borderRadius: 3 }}>
                <Typography variant="h6" p={2} textAlign="center" fontWeight="bold" color="#1976d2">
                    Khách hàng
                </Typography>
                <Divider />
                <List>
                    {clients.map(client => (
                        <ListItem
                            button
                            key={client.id}
                            onClick={() => handleSelectClient(client)}
                            sx={{
                                backgroundColor: selectedClient?.id === client.id ? '#e3f2fd' : 'transparent',
                                '&:hover': { backgroundColor: '#f0f0f0' },
                                borderLeft: selectedClient?.id === client.id ? '4px solid #1976d2' : '4px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Avatar sx={{ bgcolor: stringToColor(client.tenKhachHang), mr: 2 }}>
                                {getInitials(client.tenKhachHang)}
                            </Avatar>

                            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                <ListItemText
                                    primary={client.tenKhachHang}
                                    secondary={
                                        client.lastMessage && client.lastMessage.length > 0
                                            ? client.lastMessage.length > 15
                                                ? client.lastMessage.slice(0, 15) + '...'
                                                : client.lastMessage
                                            : ''
                                    }
                                    secondaryTypographyProps={{
                                        sx: { color: 'text.secondary', fontSize: '0.875rem' }
                                    }}
                                />
                                {client.unread && (
                                    <Box sx={{ width: 10, height: 10, bgcolor: 'error.main', borderRadius: '50%', ml: 1 }} />
                                )}
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Khung chat */}
            <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 3, p: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="#1976d2" mb={1}>
                    {selectedClient ? `💬 Chat với ${selectedClient.tenKhachHang}` : 'Chọn khách hàng để bắt đầu chat'}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Nội dung chat */}
                <Box flex={1} overflow="auto" px={1} py={0.5} bgcolor="#f5f5f5" borderRadius={2}>
                    {messages.map((msg, index) => (
                        <Box key={index} textAlign={msg.guiTuNhanVien ? 'right' : 'left'} mb={1}>
                            {
                                msg.noiDung.includes('<img') ? (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: msg.noiDung.replace(
                                                /<img[^>]+src="([^"]+)"[^>]*>/g,
                                                (match, src) => {
                                                    return `<img src="${src}" style="max-width: 200px; cursor: pointer; border-radius: 8px;" onclick="window.dispatchEvent(new CustomEvent('preview-image', { detail: '${src}' }))" />`;
                                                }
                                            )
                                        }}
                                    />

                                ) : (
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            backgroundColor: msg.guiTuNhanVien ? '#1976d2' : '#e0e0e0',
                                            color: msg.guiTuNhanVien ? 'white' : 'black',
                                            padding: '8px 16px',
                                            borderRadius: 8,
                                            maxWidth: '70%',
                                            wordBreak: 'break-word'
                                        }}
                                        dangerouslySetInnerHTML={{ __html: msg.noiDung }}
                                    />
                                )
                            }

                            <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ mt: 0.5, display: 'block' }}
                            >
                                {new Date(msg.thoiGian).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {msg.guiTuNhanVien && msg.tenNhanVien ? ` - Nhân viên ${msg.tenNhanVien}` : ''}
                            </Typography>
                        </Box>
                    ))}
                    <div ref={bottomRef} />
                </Box>

                {/* Nhập tin nhắn */}
                {selectedClient && (
                    <Box mt={2} display="flex" gap={1}>
                        <InputAdornment position="start">
                            <IconButton component="label">
                                <ImageIcon />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                            </IconButton>
                        </InputAdornment>

                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Nhập tin nhắn..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
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
                )}
            </Paper>

            {/* modal hiển thị ảnh */}
            {previewImage && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="preview"
                        style={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            objectFit: "contain",
                            borderRadius: "8px"
                        }}
                    />
                </div>
            )}

        </Box>
    );
};

export default ChatWithClient;
