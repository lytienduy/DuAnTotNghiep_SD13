import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Grid, Typography, Button, Card, CardContent, CardMedia, Container,
    Tabs, Tab, Breadcrumbs, Link, Dialog, DialogTitle, DialogContent, DialogActions, TextField, TableRow, TableCell
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DonMua = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Khai báo navigate
    const isActive = location.pathname === '/donMua'; // Kiểm tra nếu đường dẫn là /donMua
    const [tabValue, setTabValue] = useState(0);
    const [orders, setOrders] = useState([]);
    const [openLyDo, setOpenLyDo] = useState(false);  // Biến lưu giá trị mở modal nhập lý do khi thực hiện chức năng hủy hóa đơn
    const [openConfirm, setOpenConfirm] = useState(false); // Mở modal xác nhận
    const [ghiChuTrangThai, setGhiChuTrangThai] = useState("");
    const [error, setError] = useState(false);//Biến báo lỗi
    const [idHoaDonCanThaoTac, setIdHoaDonCanThaoTac] = useState(null);
    const userKH = JSON.parse(localStorage.getItem("userKH"));


    //Thông báo thành công
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

    // List trạng thái hóa đơn
    const tabLabels =
        [
            "Chờ xác nhận",
            "Chờ giao hàng",
            "Đang vận chuyển",
            "Đã giao hàng",
            "Hoàn thành",
            "Đã hủy"
        ];

    const getTotalPrice = (sanPhams) => {
        return sanPhams?.reduce((total, product) => total + product.gia * product.soLuong, 0);
    };

    const getLastNameInitial = (fullName) => {
        const nameParts = fullName.split(' ');
        const lastName = nameParts[nameParts.length - 1]; // lấy phần tên sau cùng
        return lastName.charAt(0).toUpperCase(); // lấy chữ cái đầu tiên và chuyển thành chữ hoa
    };
    const getHoaDons = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/donMua/getDonMuaTheoTrangThaiVaKhachHang`, {
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
    //Hàm kiểm tra check nhạp lý do chưa để mở confirm khi thực hiện chức năng hủy hóa đơn
    const handleNextConfirm = () => {
        if (!ghiChuTrangThai.trim()) { //Check nếu nhập lý do hủy hóa đơn
            setError(true);
        } else {
            setError(false);
            setOpenLyDo(false);
            setOpenConfirm(true);
        }
    };
    //Hàm mở modal nhập lý do hủy hóa đơn khi thực hiện chức năng hủy hóa đơn
    const handleOpenLyDo = (id) => {
        setIdHoaDonCanThaoTac(id);
        setOpenLyDo(true);
    };
    //Hàm thực hiện chức năng hủy hóa đơn gọi api
    const handleHuyHoaDon = async () => {
        try {
            if (idHoaDonCanThaoTac === null) {
                showErrorToast("Chúng tôi không nhận được id hóa đơn cần thao tác");
                return;
            }
            const response = await axios.post(`http://localhost:8080/hoa-don/cap-nhat-trang-thai-hoa-don/${idHoaDonCanThaoTac}`, {
                lyDo: ghiChuTrangThai,
                trangThai: "Đã hủy",
                hanhDong: "Hủy"
            });
            if (response.data) {
                setOpenConfirm(false);
                setGhiChuTrangThai("");
                getHoaDons();
                showSuccessToast("Hủy hóa đơn thành công")
            } else {
                showErrorToast("Hủy hóa đơn đã có lỗi xảy ra");
            }
        } catch (error) {
            showErrorToast("Hủy hóa đơn đã có lỗi xảy ra");
            console.error(error);
        }
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
                            value={tabValue}
                            onChange={(e, newValue) => setTabValue(newValue)} // Bắt buộc có 2 tham số
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="order status tabs"
                            variant="scrollable"
                            scrollButtons={false} // Ẩn mũi tên cuộn
                            allowScrollButtonsMobile={false} // Ngăn xuất hiện trên mobile
                            sx={{
                                width: "100%",
                                minHeight: 48,
                                overflow: "visible", // Giữ tab không bị tụt vào trong
                            }}
                        >
                            {tabLabels.map((label, index) => (
                                <Tab key={index} label={label} />
                            ))}
                        </Tabs>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                                    <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 5, marginLeft: -2, width: 830, backgroundColor: '#fff' }}>
                                        <img
                                            src="https://img.freepik.com/premium-vector/result-not-found_878233-777.jpg"
                                            alt="No data"
                                            style={{ width: '150px', height: 'auto' }}
                                        />
                                        <Typography variant="h6" sx={{ marginTop: '-40px', paddingBottom: 10 }}>
                                            Không có hóa đơn nào
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => {
                                const listThanhToan = (order?.listThanhToanHoaDon || [])
                                    .filter(tt => tt?.loai !== "Hoàn tiền")

                                const listHoanTien = (order?.listThanhToanHoaDon || [])
                                    .filter(tt => tt?.loai === "Hoàn tiền") // Lọc chỉ lấy các phần tử có id = 3

                                const tongTienDaThanhToanVaDaHoanTienCuaOnline = listThanhToan?.reduce((tong, tt) => tong + tt?.soTien, 0) - listHoanTien?.reduce((tong, tt) => tong + tt?.soTien, 0); // Tính tiền cần hoàn lấy tiền đã thanh toán trừ đi tiền đã hoàn so sánh với số tiền cần thanh toán của hóa đơn                           
                                return (
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
                                                Mã đơn: {order.maHoaDon}
                                            </Typography>
                                            <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#1976D2' }}>
                                                Trạng thái: {(tongTienDaThanhToanVaDaHoanTienCuaOnline === order?.tongTienThanhToan && listHoanTien?.length > 0 && (tabValue === 4 || tabValue === 5)) ? "Đã hoàn tiền" : order?.trangThai}
                                            </Typography>
                                        </Box>
                                        {order?.sanPhams?.map((product, index) => (
                                            <Card
                                                key={index}
                                                sx={{
                                                    marginTop: 0,
                                                    borderRadius: 0,
                                                    border: 'none',
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={2}>
                                                            <CardMedia
                                                                component="img"
                                                                sx={{ width: 70, height: 70, objectFit: 'cover' }}
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
                                                                        Giá: {(product.gia * product.soLuong)?.toLocaleString()} VNĐ
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
                                                Thành tiền: {getTotalPrice(order.sanPhams)?.toLocaleString()} VNĐ
                                            </Typography>
                                            <Box>
                                                {order?.trangThai === "Chờ xác nhận" &&
                                                    <Button variant="contained" sx={{ marginRight: 2 }} onClick={() => handleOpenLyDo(order?.id)}>
                                                        Hủy đơn
                                                    </Button>
                                                }
                                                <Button variant="outlined" sx={{ color: 'black' }} onClick={() => navigate(`/donMuaChiTiet/${order?.id}`)}>
                                                    <ShoppingCartIcon sx={{ marginRight: 1 }} />
                                                    Xem đơn hàng
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                )
                            }))}
                    </Grid>
                </Grid>
            </Box>
            <Dialog open={openLyDo} onClose={() => setOpenLyDo(false)}>
                <DialogTitle>Nhập lý do hủy hóa đơn</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Lý do hủy"
                        variant="outlined"
                        value={ghiChuTrangThai}
                        onChange={(e) => { setGhiChuTrangThai(e.target.value); setError(false) }}
                        error={error} // Hiển thị lỗi nếu có
                        helperText={error ? "Bạn chưa nhập lý do!" : ""} // Nội dung lỗi
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenLyDo(false); setIdHoaDonCanThaoTac(null) }} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleNextConfirm} color="error" variant="contained">
                        Tiếp tục
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Xác nhận hủy hóa đơn</DialogTitle>
                <DialogContent>
                    <p><b>Lý do hủy:</b> {ghiChuTrangThai}</p>
                    <p>Bạn có chắc chắn muốn hủy hóa đơn này không?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenConfirm(false); setIdHoaDonCanThaoTac(null) }} color="primary">
                        Quay lại
                    </Button>
                    <Button onClick={handleHuyHoaDon} color="error" variant="contained">
                        Xác nhận hủy
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Container>
    );
};

export default DonMua;