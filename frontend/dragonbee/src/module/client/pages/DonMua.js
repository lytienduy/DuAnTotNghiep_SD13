import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Grid, Typography, Button, Card, CardContent, CardMedia, Container,
    Tabs, Tab, Breadcrumbs, Link,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DonMua = () => {
    const location = useLocation();
    const isActive = location.pathname === '/donMua'; // Kiểm tra nếu đường dẫn là /donMua
    const [tabValue, setTabValue] = useState(0);
    const [orders, setOrders] = useState([]);
    const userKH = JSON.parse(localStorage.getItem("userKH"));

    // List trạng thái hóa đơn
    const tabLabels =
        [
            "Chờ xác nhận",
            "Đã xác nhận",
            "Chờ giao hàng",
            "Đang vận chuyển",
            "Đã giao hàng",
            "Hoàn thành",
            "Đã hủy"
        ];

    const getTotalPrice = (products) => {
        return products.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    const getLastNameInitial = (fullName) => {
        const nameParts = fullName.split(' ');
        const lastName = nameParts[nameParts.length - 1]; // lấy phần tên sau cùng
        return lastName.charAt(0).toUpperCase(); // lấy chữ cái đầu tiên và chuyển thành chữ hoa
    };
    const getHoaDons = async () => {
        try {  
            console.log(tabLabels[tabValue]+" - "+userKH?.khachHang?.id || 0);        
            const response = await axios.get(`http://localhost:8080/donMua/getDonMuaTheoTrangThaiVaKhachHang`, null, {
                params: {
                    trangThai: tabLabels[tabValue],
                    idKhachHang: userKH?.khachHang?.id || 0 // Nếu userKH không có, gửi 0 thay vì undefined
                }
            });
           setOrders(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    };
    //Khi tabValue thay đổi giá trị
    useEffect(() => {
        getHoaDons();
    }, [tabValue]);
    return (
        <Container >
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="http://localhost:3000/home" sx={{ fontSize: '14px', textDecoration: 'none' }}>
                    Trang chủ
                </Link>
                <Typography color="text.primary" sx={{ fontSize: '14px' }}>
                    Đơn mua
                </Typography>
            </Breadcrumbs>
            <Box sx={{ padding: 0, marginTop: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 0 }}>
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    backgroundColor: 'gray',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="body1" fontWeight="bold" color="white" sx={{ fontSize: 30 }}>
                                    {getLastNameInitial("Lý Tiến Duy")}
                                </Typography>
                            </Box>
                            <Box sx={{ marginLeft: '10px' }}>
                                <Typography variant="body1" fontWeight="bold">
                                    Lý Tiến Duy
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EditIcon sx={{ fontSize: 16, marginRight: 1 }} />
                                    Sửa hồ sơ
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ marginTop: 2, marginLeft: -2 }}>
                            <Button
                                variant="text"
                                sx={{
                                    textAlign: 'left',
                                    paddingLeft: 2,  // Thêm padding trái để chữ gần lề trái hơn
                                    paddingRight: 2,
                                    color: 'text.primary',
                                    display: 'flex',  // Sử dụng flex để căn chỉnh icon và text
                                    justifyContent: 'flex-start',  // Căn trái cho các phần tử
                                }}
                            >
                                <AccountCircleIcon sx={{ marginRight: 1 }} />
                                Tài khoản của tôi
                            </Button>
                            <Button
                                variant="text"
                                sx={{
                                    textAlign: 'left',
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                    color: isActive ? '#1976D2' : 'text.primary', // Đổi màu nếu đường dẫn là /donMua
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <ShoppingCartIcon sx={{ marginRight: 1, color: isActive ? '#1976D2' : 'inherit' }} />
                                Đơn mua
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={9.5}>
                        {/* Tab Header */}
                        <Tabs
                            value={tabValue}
                            onChange={(e, newValue) => setTabValue(newValue)}//Bắt buộc có 2 tham số 
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="order status tabs"
                        >
                            {tabLabels.map((label, index) => {
                                <Tab key={index} label={{ label }} />
                            })}
                        </Tabs>

                        {orders?.map((order) => (
                            <Box
                                key={order.id}
                                sx={{
                                    border: '1px solid #e0e0e0', // Đường viền xung quanh khung
                                    borderRadius: 2,
                                    padding: 2, // Padding bên trong khung
                                    boxShadow: 2, // Tạo hiệu ứng bóng cho khung
                                    marginTop: 3, // Khoảng cách từ trên xuống
                                    backgroundColor: '#fff', // Màu nền của khung
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 1 }}>
                                    {/* Mã hóa đơn bên trái */}
                                    <Typography sx={{ fontWeight: 'bold', fontSize: 18 }}>
                                        Mã đơn: {order.maHoaDon}
                                    </Typography>

                                    {/* Trạng thái bên phải */}
                                    <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#1976D2' }}>
                                        Trạng thái: {order.trangThai}
                                    </Typography>
                                </Box>

                                {order?.sanPhams?.map((product, index) => (
                                    <Card
                                        sx={{
                                            marginTop: 0,
                                            borderRadius: 0, // Bỏ bo góc tròn
                                            border: 'none',
                                        }}
                                        key={index}
                                    >
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={2}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{
                                                            width: 70,
                                                            height: 70,
                                                            objectFit: 'cover',
                                                        }}
                                                        image={product.hinhAnh}
                                                        alt={product.tenSanPham}
                                                    />
                                                </Grid>

                                                <Grid item xs={9}>
                                                    <Typography variant="body1" component="div">
                                                        <strong>{product.tenSanPham}</strong>
                                                    </Typography>
                                                    <Grid container spacing={2} sx={{ marginTop: 0 }}>
                                                        <Grid item>
                                                            <Typography variant="body2">Màu sắc: {product.mauSac}</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="body2">Số lượng: {product.soLuong}</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="body2">Kích thước: {product.size}</Typography>
                                                        </Grid>

                                                        <Grid item>
                                                            <Typography variant="body2">
                                                                Giá: {(product.gia * product.soLuong).toLocaleString()} VNĐ
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Thành tiền: {getTotalPrice(order.products).toLocaleString()} VNĐ
                                    </Typography>

                                    <Box>
                                        <Button variant="contained" sx={{ marginRight: 2 }}>
                                            Hủy đơn
                                        </Button>
                                        <Button variant="outlined" sx={{ color: 'black' }}>
                                            <ShoppingCartIcon sx={{ marginRight: 1 }} />
                                            Xem đơn hàng
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default DonMua;