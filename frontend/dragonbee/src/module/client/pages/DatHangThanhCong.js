import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Divider, Box, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const products = [
    {
        name: "GIÀY MLB CHUNKY WIDE NEW YORK (ĐEN - 39)",
        color: "Đen",
        quantity: 1,
        size: 39,
        danhMuc: "Business",
        image: "https://product.hstatic.net/200000887901/product/img_3922.1_c94dbbc31a064475916e5b9042fd8fdb.jpg",
    },
    {
        name: "GIÀY ADIDAS ORIGINALS (XÁM - 42)",
        color: "Xám",
        quantity: 1,
        size: 42,
        danhMuc: "Golf",
        image: "https://product.hstatic.net/200000887901/product/am-aristino-regular-fit-atr0180z__17__e21deeca2c71449e88005c10efea4ecb_b98dacd36e16476aaf01effbcf884885.jpg",
    },
];

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