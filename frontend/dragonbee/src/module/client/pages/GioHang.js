import React, { useState } from 'react';
import {
    Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography
    , TextField, IconButton, Checkbox, Breadcrumbs, Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';

const GioHang = () => {
    const navigate = useNavigate();

    const handlePaymentClick = () => {
        navigate('/thanhToan');
    };
    const initialProducts = [
        {
            name: 'Quần âu Aristino ATRR02 (ATTR0209) dáng 29',
            price: 347500,
            quantity: 1,
            image: 'https://360.com.vn/wp-content/uploads/2024/11/APHTK533-QSKTK514-2.jpg',
        },
        {
            name: 'Quần Tây Nam Owen QS232454 Màu xanh navy 29',
            price: 520000,
            quantity: 1,
            image: 'https://360.com.vn/wp-content/uploads/2023/12/AKGTK501-QGGTK502-8.jpg',
        }
    ];

    const [products, setProducts] = useState(initialProducts);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleRemoveProduct = (index) => {
        setProducts(prevProducts => prevProducts.filter((_, i) => i !== index));
        setSelectedProducts(prevSelected => prevSelected.filter(i => i !== index)); // Xóa sản phẩm khỏi danh sách chọn nếu bị xóa
    };

    const handleChangeQuantity = (index, newQuantity) => {
        const updatedProducts = [...products];
        updatedProducts[index].quantity = newQuantity;
        setProducts(updatedProducts);
    };

    const handleIncrement = (index) => {
        const updatedProducts = [...products];
        updatedProducts[index].quantity += 1;
        setProducts(updatedProducts);
    };

    const handleDecrement = (index) => {
        const updatedProducts = [...products];
        updatedProducts[index].quantity = Math.max(updatedProducts[index].quantity - 1, 1);
        setProducts(updatedProducts);
    };

    const handleToggleSelect = (index) => {
        const updatedSelection = [...selectedProducts];
        if (updatedSelection.includes(index)) {
            const productIndex = updatedSelection.indexOf(index);
            updatedSelection.splice(productIndex, 1);
        } else {
            updatedSelection.push(index);
        }
        setSelectedProducts(updatedSelection);
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            const allProductIndexes = products.map((_, index) => index);
            setSelectedProducts(allProductIndexes);
        }
    };

    // Tính tổng tiền chỉ cho các sản phẩm được chọn
    const totalAmount = selectedProducts.reduce((sum, index) => {
        const product = products[index];
        return sum + product.price * product.quantity;
    }, 0);

    return (
        <Container>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="http://localhost:3000/home" sx={{ fontSize: '14px', textDecoration: 'none' }}>
                    Trang chủ
                </Link>
                <Typography color="text.primary" sx={{ fontSize: '14px' }}>
                    Giỏ hàng (21)
                </Typography>
            </Breadcrumbs>
            <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 3 }} gutterBottom>Giỏ hàng của bạn <span style={{ fontSize: '14px', color: 'gray' }}>(2 sản phẩm)</span></Typography>
            <Grid container spacing={2}>
                {/* Phần hiển thị sản phẩm */}
                <Grid item xs={9}>
                    <Paper elevation={3}>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                            <Checkbox
                                                checked={selectedProducts.length === products.length}
                                                onChange={handleSelectAll}
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ paddingLeft: '10px', paddingRight: '10px', whiteSpace: 'nowrap' }}>Sản phẩm</TableCell>
                                        <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '10px', whiteSpace: 'nowrap', width: '100px' }}>Giá</TableCell>
                                        <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '10px', whiteSpace: 'nowrap' }}>Số lượng</TableCell>
                                        <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '10px', whiteSpace: 'nowrap', width: '120px' }}>Thành tiền</TableCell>
                                        <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '20px', whiteSpace: 'nowrap' }}>Hành động</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {products.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell padding="checkbox" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                                <Checkbox
                                                    checked={selectedProducts.includes(index)}
                                                    onChange={() => handleToggleSelect(index)}
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                                <Grid container spacing={2} alignItems="center" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <Grid item>
                                                        <img src={product.image} alt={product.name} width={80} height={80} />
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{product.name}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                            <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                                {product.price.toLocaleString()} VNĐ
                                            </TableCell>
                                            <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <TextField
                                                        type="text"
                                                        value={product.quantity}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value;
                                                            // Kiểm tra xem giá trị có phải là số nguyên và nằm trong khoảng từ 1 đến 999 không
                                                            if (/^[1-9]\d{0,2}$/.test(inputValue)) {
                                                                const newValue = Math.max(1, Math.min(parseInt(inputValue), 999)); // Đảm bảo giá trị trong khoảng từ 1 đến 999
                                                                handleChangeQuantity(index, newValue);
                                                            }
                                                        }}
                                                        inputProps={{ min: 1 }}
                                                        sx={{
                                                            width: '105px',  // Điều chỉnh chiều rộng của TextField
                                                            textAlign: 'center',
                                                            padding: '0',
                                                            border: 'none',
                                                            outline: 'none',
                                                            fontSize: '18px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            '& input': {
                                                                textAlign: 'center',
                                                                padding: '5px 10px',
                                                            },
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <IconButton
                                                                    onClick={() => handleDecrement(index)}
                                                                    size="small"
                                                                    style={{ padding: '2px', marginLeft: -10 }}
                                                                >
                                                                    <RemoveIcon fontSize="small" />
                                                                </IconButton>
                                                            ),
                                                            endAdornment: (
                                                                <IconButton
                                                                    onClick={() => handleIncrement(index)}
                                                                    size="small"
                                                                    style={{ padding: '2px', marginRight: -10 }}
                                                                >
                                                                    <AddIcon fontSize="small" />
                                                                </IconButton>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                                {(product.price * product.quantity).toLocaleString()} VNĐ
                                            </TableCell>
                                            <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                                <DeleteIcon color="error" onClick={() => handleRemoveProduct(index)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Phần tạm tính thành tiền */}
                <Grid item xs={3}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6" gutterBottom>Tạm tính</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {totalAmount.toLocaleString()} đ
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: 2 }}
                            onClick={handlePaymentClick}  // Attach the onClick handler to the button
                        >
                            Tiến hành thanh toán
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default GioHang;
