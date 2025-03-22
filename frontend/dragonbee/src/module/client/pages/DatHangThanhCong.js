import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Divider, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
                        <Typography variant="h4" fontWeight="bold">
                            Đặt hàng thành công!
                        </Typography>

                        <Divider sx={{ marginTop: 3, marginBottom: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Thông tin giao hàng
                                </Typography>
                                <Typography variant="body1">
                                    Thi Huong Giang Nguyen
                                </Typography>
                                <Typography variant="body1">
                                    09618221111
                                </Typography>
                                <Typography variant="body1">
                                    khuchThiHuong@gmail.com
                                </Typography>
                                <Typography variant="body1">
                                    40 To Vinh Dien, Quận Ba Đình, VN
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop:3 }}>
                                    Phương thức thanh toán
                                </Typography>
                                <Typography variant="body1">
                                    Thanh toán khi giao hàng (COD)
                                </Typography>
                            </Grid>
{/* 
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    Phương thức thanh toán
                                </Typography>
                                <Typography variant="body2">
                                    Thanh toán khi giao hàng (COD)
                                </Typography>
                            </Grid> */}
                        </Grid>

                    </Box>

                    <Divider sx={{ marginTop: 3, marginBottom: 2 }} />

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '8px', textAlign: 'left', color: 'grey', fontWeight: 'normal', fontSize: 14 }}>Mã đơn hàng</th>
                                <th style={{ padding: '8px', textAlign: 'left', color: 'grey', fontWeight: 'normal', fontSize: 14 }}>Ngày</th>
                                <th style={{ padding: '8px', textAlign: 'left', color: 'grey', fontWeight: 'normal', fontSize: 14 }}>Tạm tính</th>
                                <th style={{ padding: '8px', textAlign: 'left', color: 'grey', fontWeight: 'normal', fontSize: 14 }}>Giảm giá</th>
                                <th style={{ padding: '8px', textAlign: 'left', color: 'grey', fontWeight: 'normal', fontSize: 14 }}>Phí ship</th>
                                <th style={{ padding: '8px', textAlign: 'left', color: 'grey', fontWeight: 'normal', fontSize: 14 }}>Tổng thanh toán</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>HD15030035</td>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>18:18:30 21/12/2023</td>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>90.000 đ</td>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>0 đ</td>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>91.301 đ</td>
                                <td style={{ padding: '8px', fontWeight: 'bold', color: '#1976d2' }}>181.301 đ</td>
                            </tr>
                        </tbody>
                    </table>


                    <Divider sx={{ marginTop: 3 }} />

                    <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'bold', fontSize: '15px' }}>
                        Danh sách sản phẩm
                    </Typography>

                    {products.map((product, index) => (
                        <Card sx={{ marginTop: 0 }} key={index}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: 70,         // Explicitly set the width to 140px to create a square
                                                height: 70,        // Set the height to the same as the width
                                                objectFit: 'cover', // Ensures the image fits without distortion
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
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </Container>
    );
};

export default DatHangThanhCong;