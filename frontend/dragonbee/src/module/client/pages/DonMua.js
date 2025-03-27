import React from 'react';
import {
    Box, Grid, Typography, Button, Card, CardContent, CardMedia, Container,
    Tabs, Tab, Breadcrumbs, Link,TableRow,TableCell
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DonMua = () => {
    const location = useLocation();
    const isActive = location.pathname === '/donMua'; // Kiểm tra nếu đường dẫn là /donMua
    const orders = [
        {
            id: 1,
            maHD: 'HD920112111',
            status: 'Chờ xác nhận',
            products: [
                {
                    id: 1,
                    name: 'Giày Thể Thao Nam Nike Nike Dbreak-Type',
                    color: 'Đen',
                    quantity: 1,
                    price: 2000000,
                    size: 40,
                    danhMuc: 'Casual',
                    image: 'https://product.hstatic.net/200000887901/product/img_3922.1_c94dbbc31a064475916e5b9042fd8fdb.jpg',
                },
                {
                    id: 2,
                    name: 'Giày Chạy Nam Adidas Ultraboost Cc_1 Dna FZ2545',
                    color: 'Đen',
                    quantity: 1,
                    price: 2500000,
                    size: 42,
                    danhMuc: 'Business',
                    image: 'https://product.hstatic.net/200000887901/product/am-aristino-regular-fit-atr0180z__17__e21deeca2c71449e88005c10efea4ecb_b98dacd36e16476aaf01effbcf884885.jpg',
                },
            ],
        },
        {
            id: 2,
            maHD: 'HD0122112111',
            status: 'Vận chuyển',
            products: [
                {
                    id: 3,
                    name: 'Giày Thể Thao Nam Adidas Boost',
                    color: 'Trắng',
                    quantity: 2,
                    price: 4000000,
                    size: 42,
                    danhMuc: 'Golf',
                    image: 'https://product.hstatic.net/200000887901/product/img_3922.1_c94dbbc31a064475916e5b9042fd8fdb.jpg',
                },
            ],
        },
    ];


    const getTotalPrice = (products) => {
        return products.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    const getLastNameInitial = (fullName) => {
        const nameParts = fullName.split(' ');
        const lastName = nameParts[nameParts.length - 1]; // lấy phần tên sau cùng
        return lastName.charAt(0).toUpperCase(); // lấy chữ cái đầu tiên và chuyển thành chữ hoa
    };

    const [value, setValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

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
                            value={value}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="order status tabs"
                        >
                            <Tab label="Tất cả" />
                            <Tab label="Chờ xác nhận" />
                            <Tab label="Chờ vận chuyển" />
                            <Tab label="Vận chuyển" />
                            <Tab label="Hoàn thành" />
                            <Tab label="Đã hủy" />
                        </Tabs>

                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                                    <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 5, marginLeft: -2,width:745,backgroundColor:'#fff' }}>
                                        <img
                                            src="https://img.freepik.com/premium-vector/result-not-found_878233-777.jpg"
                                            alt="No data"
                                            style={{ width: '150px', height: 'auto' }}
                                        />
                                        <Typography variant="h6" sx={{ marginTop: '-40px',paddingBottom:10 }}>Không có hóa đơn nào</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <Box
                                    key={order.id}
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        padding: 2,
                                        boxShadow: 2,
                                        marginTop: 3,
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 1 }}>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: 18 }}>
                                            Mã đơn: {order.maHD}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#1976D2' }}>
                                            Trạng thái: {order.status}
                                        </Typography>
                                    </Box>

                                    {order.products.map((product, index) => (
                                        <Card
                                            sx={{
                                                marginTop: 0,
                                                borderRadius: 0,
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
                                                            image={product.image}
                                                            alt={product.name}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={9}>
                                                        <Typography variant="body1" component="div">
                                                            <strong>{product.name}</strong>
                                                        </Typography>
                                                        <Grid container spacing={2} sx={{ marginTop: 0 }}>
                                                            <Grid item>
                                                                <Typography variant="body2">Màu sắc: {product.color}</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant="body2">Số lượng: {product.quantity}</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant="body2">Kích thước: {product.size}</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant="body2">Danh mục: {product.danhMuc}</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant="body2">
                                                                    Giá: {product.price.toLocaleString()} VNĐ
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
                            ))
                        )}

                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default DonMua;