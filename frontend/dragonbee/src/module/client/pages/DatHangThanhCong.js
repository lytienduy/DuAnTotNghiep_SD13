import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Divider, Box, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const DatHangThanhCong = () => {

    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate("/home"); // Điều hướng về trang phiếu giảm giá
    };

    return (
        <Container >
            <Card sx={{ padding: 2, marginTop: 4 }}>
                <CardContent>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ textAlign: 'center', padding: 1 }}
                    >
                        {/* Icon */}
                        <CheckCircleIcon fontSize="large" sx={{ fontSize: 100, marginBottom: 2, color: '#59d25f' }} />
                        {/* Main Title */}
                        <Typography variant="h5" fontWeight="bold">
                            Đặt hàng thành công!
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default DatHangThanhCong;