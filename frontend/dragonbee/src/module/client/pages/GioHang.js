import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography
    , TextField, IconButton, Checkbox, Breadcrumbs, Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const GioHang = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productsCapNhat, setProductsCapNhat] = useState([]);

    //Thông báo Toast
    const showSuccessToast = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            style: {
                backgroundColor: "#1976D2", // Màu nền xanh đẹp hơn
                color: "white", // Chữ trắng nổi bật
                fontSize: "14px", // Nhỏ hơn một chút
                fontWeight: "500",
                borderRadius: "8px",
            }
        });
    };
    const showErrorToast = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            style: {
                backgroundColor: "#D32F2F", // Màu đỏ cảnh báo
                color: "white", // Chữ trắng nổi bật
                fontSize: "14px", // Nhỏ hơn một chút
                fontWeight: "500",
                borderRadius: "8px",
            }
        });
    };

    //Hàm cập nhật số lượng trong giỏ hàng
    const getListDanhSachCapNhatSoLuongSanPhamGioHang = async () => {
        try { 
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const response = await axios.post(`http://localhost:8080/gioHang/getListDanhSachCapNhatSoLuongSanPhamGioHang`, cart, // Gửi mảng JSON
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });//Gọi api bằng axiosGet
            setProductsCapNhat(response.data);
            for (const [index, item] of cart.entries()) {
                if (response.data?.[index]?.quantity === 0) {
                    cart[index].quantity = 0;
                    showErrorToast("Sản phẩm đã hết hàng bạn có thể tham khảo sản phẩm khác");
                } else if (item?.quantity !== response.data?.[index]?.quantity) {
                    cart[index].quantity = response.data?.[index]?.quantity;
                    showErrorToast("Sản phẩm không còn đủ số lượng bạn mong muốn");
                }
            }
            for (let i = 0; i < cart.length; ++i) {
                if (cart[i]?.quantity === 0) {
                    cart.splice(i, 1); // Xóa sản phẩm đã hết hàng
                }
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            layDuLieuCart();
        } catch (error) {
            showErrorToast("Lỗi khi lấy dữ liệu sản phẩm chi tiết")
        }
    };

    const handlePaymentClick = () => {
        if (selectedProducts?.length === 0) {
            showErrorToast("Bạn chưa chọn sản phẩm cần thanh toán");
            return;
        } else {
            navigate('/thanhToan', { state: { selectedProducts } });
        }
    };

    const layDuLieuCart = (index) => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setProducts(storedCart);
    };

    useEffect(() => {
        layDuLieuCart();
        const interval = setInterval(() => {
            getListDanhSachCapNhatSoLuongSanPhamGioHang();
        }, 10000); // 60 giây

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, []);

    const handleRemoveProduct = (index) => {
        //Cập nhật lại products
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        // Lọc bỏ sản phẩm có id trùng với productId
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1); // Xóa 1 phần tử tại vị trí `index`
        }
        // Cập nhật lại giỏ hàng trong Local Storage   
        localStorage.setItem("cart", JSON.stringify(cart));
        layDuLieuCart();
        setSelectedProducts(prevSelected => prevSelected.filter(i => i !== index)); // Xóa sản phẩm khỏi danh sách chọn nếu bị xóa    
    };

    const handleChangeQuantity = (index, newQuantity) => {
        if (newQuantity <= 10) {
            // Lấy giỏ hàng từ Local Storage
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Cập nhật số lượng sản phẩm trong `cart` dựa vào `index`
            if (index >= 0 && index < cart.length) {
                cart[index].quantity = newQuantity;
            }
            // Cập nhật lại giỏ hàng trong Local Storage
            localStorage.setItem("cart", JSON.stringify(cart));
            // Load lại giỏ hàng sau khi cập nhật
            layDuLieuCart();
        }
    };


    const handleIncrement = (index) => {
        
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        // Cập nhật số lượng sản phẩm trong `cart` dựa vào `index`
        if (index >= 0 && index < cart.length) {
            cart[index].quantity += 1;
            
        }
        // Cập nhật lại giỏ hàng trong Local Storage
        localStorage.setItem("cart", JSON.stringify(cart));
        // Load lại giỏ hàng sau khi cập nhật
        layDuLieuCart();
    };

    const handleDecrement = (index) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Cập nhật số lượng sản phẩm trong `cart` dựa vào `index`
        if (index >= 0 && index < cart.length) {
            cart[index].quantity = Math.max(cart[index]?.quantity - 1, 1);
        }
        // Cập nhật lại giỏ hàng trong Local Storage
        localStorage.setItem("cart", JSON.stringify(cart));
        // Load lại giỏ hàng sau khi cập nhật
        layDuLieuCart();
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
        return sum + product.gia * product?.quantity;
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
                                                        <img src={product.anhSPCT} alt={product.tenSPCT} width={80} height={80} />
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{product.tenSPCT}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                            <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                                {product?.gia?.toLocaleString()} VNĐ
                                            </TableCell>
                                            <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <TextField
                                                        type="text"
                                                        value={product?.quantity}
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
                                                                    // disabled={product.quantity >= productsCapNhat?.[index]?.quantity}
                                                                >
                                                                    <AddIcon fontSize="small" />
                                                                </IconButton>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell align="center" sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                                {(product.gia * product?.quantity).toLocaleString()} VNĐ
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
                            {totalAmount?.toLocaleString()} đ
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
            <ToastContainer />
        </Container>
    );
};

export default GioHang;
