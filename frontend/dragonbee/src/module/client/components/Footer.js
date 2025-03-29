import React from "react";
import { Box, Container, Grid, Typography, TextField, Button, IconButton } from "@mui/material";
import { Facebook, Instagram, YouTube, Twitter } from "@mui/icons-material";
import logo from '../../../img/bannerFooter.png';
const Footer = () => {
    return (
        <Box sx={{ backgroundColor: "#bcbcbc80", color: "#333", marginTop: 8 }}>
            {/* Banner */}
            <Box
                sx={{
                    width: '100%',
                    height: 200,
                    backgroundImage: `url(${logo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'bottom',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    flexDirection: 'column'
                }}
            >
                {/* Overlay để làm tối nền giúp chữ dễ đọc */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                />

                {/* Chữ Banner */}
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        fontSize: { xs: '1.5rem', md: '2.5rem' }, // Responsive font size
                    }}
                >
                    XEM HÀNG TRỰC TIẾP TẠI
                </Typography>

                {/* Địa chỉ */}
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        backgroundColor: 'white',
                        color: '#1976D2',
                        padding: '5px 15px',
                        borderRadius: '20px',
                        mt: 1, // Khoảng cách với tiêu đề
                        fontSize: { xs: '0.8rem', md: '1rem' },
                        fontWeight: 'bold',
                        height: 25
                    }}
                >
                    Trụ sở chính Tòa nhà FPT Polytechnic, Phố Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
                </Box>

                {/* Line kẻ phía dưới */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: 8,
                        backgroundColor: '#1976D2',
                    }}
                />
            </Box>


            <Container maxWidth="lg" sx={{ marginTop: 2 }}>
                <Grid container spacing={4}>
                    {/* Cột 1: Giới thiệu */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold">Thương hiệu & Hệ thống cửa hàng</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>Về thương hiệu Dragonbee</Typography>
                        <Typography variant="body2">Hệ thống cửa hàng</Typography>
                        <Typography variant="body2">Tuyển dụng</Typography>
                    </Grid>

                    {/* Cột 2: Chính sách */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold">Chính sách khách hàng</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>Chính sách bảo mật thông tin</Typography>
                        <Typography variant="body2">Chính sách đổi trả</Typography>
                        <Typography variant="body2">Chính sách vận chuyển</Typography>
                    </Grid>

                    {/* Cột 3: Liên hệ */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold">Công ty cổ phần thời trang DragonBee</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>Hotline: 0961886385</Typography>
                        <Typography variant="body2">Email: dragonbeeshop@gmail.com</Typography>
                        <Typography variant="body2">GPKD: 0123456789</Typography>
                    </Grid>

                    {/* Cột 4: Kết nối & Đăng ký nhận tin */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold">Kết nối với DragonBee</Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                            <IconButton color="primary"><Facebook /></IconButton>
                            <IconButton color="secondary"><Instagram /></IconButton>
                            <IconButton color="error"><YouTube /></IconButton>
                            <IconButton color="info"><Twitter /></IconButton>
                        </Box>

                    </Grid>
                </Grid>

            </Container>
            {/* Dòng bản quyền */}
            <Typography
                variant="body2"
                sx={{ textAlign: "center", mt: 4, p: 1, borderTop: "1px solid #ddd", backgroundColor: '#5b5b5b', color: '#cacaca' }}
            >
                Copyright 2025 © Quần âu DragonBee - All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
