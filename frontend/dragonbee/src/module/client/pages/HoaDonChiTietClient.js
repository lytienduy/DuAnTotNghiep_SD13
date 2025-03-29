import React, {useRef, useEffect, useState } from "react";
import axios from "axios"; // Import axios
import {
  Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Grid, Divider, IconButton, TextField,Chip

} from "@mui/material";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";


const HoaDonChiTietClient = () => {
  //Khai báo useState
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); //Lấy id khi truyền đến trang này bằng useParams
  const [hoaDon, setHoaDon] = useState({}); //Biến lưu dữ liệu hóa đơn
  const [imageIndexes, setImageIndexes] = useState({});//Biến lưu giá trị key(idSPCT từ HDCT) cùng index hình ảnh hiện tại 

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
  //List trạng thái hóa đơn
  const steps = hoaDon.loaiHoaDon === "Tại quầy"
    ? (hoaDon.sdtNguoiNhanHang === null
      ? ["Chờ thêm sản phẩm", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành"]
      : ["Chờ thêm sản phẩm", "Chờ xác nhận", "Đã xác nhận", "Chờ giao hàng", "Đang vận chuyển", "Đã giao hàng", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành"]
    )
    : ["Chờ xác nhận", "Đã xác nhận", "Chờ giao hàng", "Đang vận chuyển", "Đã giao hàng", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành"];

  const handleWheel = (event) => {
    if (scrollRef.current) {
      event.preventDefault();
      scrollRef.current.scrollLeft += event.deltaY;
    }
  };

  //Hàm trả về CSS khung theo trạng thái
  const getStatusStyles = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return { backgroundColor: "#FFF9C4", color: "#9E9D24" }; // Vàng nhạt
      case "Đã xác nhận":
        return { backgroundColor: "#C8E6C9", color: "#388E3C" }; // Xanh lá nhạt
      case "Chờ giao hàng":
        return { backgroundColor: "#FFE0B2", color: "#E65100" }; // Cam nhạt
      case "Đang vận chuyển":
        return { backgroundColor: "#BBDEFB", color: "#1976D2" }; // Xanh dương nhạt
      case "Đã giao hàng":
        return { backgroundColor: "#DCEDC8", color: "#689F38" }; // Xanh lá nhạt hơn
      case "Đã thanh toán":
        return { backgroundColor: "#E1BEE7", color: "#8E24AA" }; // Tím nhạt
      case "Chờ thanh toán":
        return { backgroundColor: "#FFCCBC", color: "#D84315" }; // Đỏ cam nhạt
      case "Hoàn thành":
        return { backgroundColor: "#CFD8DC", color: "#455A64" }; // Xám nhạt
      case "Đã hủy":
        return { backgroundColor: "#FFCDD2", color: "#C62828" }; // Đỏ nhạt
      default:
        return { backgroundColor: "#E3F2FD", color: "#000" }; // Màu mặc định (xanh siêu nhẹ)
    }
  };
  //Hàm gọi api lấy hóa đơn
  const fetchHoaDon = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/hoa-don-chi-tiet/${id}`);
      setHoaDon(response.data); // Dữ liệu được lấy từ response.data
    } catch (err) {
      showErrorToast("Không load được hóa đơn");
    }
  };

  //Lấy dữ liệu hóa đơn
  useEffect(() => {
    fetchHoaDon();
  }, []);

  //Hàm load ảnh
  useEffect(() => {
    if (!hoaDon || !hoaDon.listDanhSachSanPham) return; // Kiểm tra nếu hoaDon chưa load hoặc hoaDon.listDanhSachSanPham rỗng
    const interval = setInterval(() => {
      setImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        hoaDon.listDanhSachSanPham.forEach((product) => {
          if (product.hinhAnh.length > 1) {
            newIndexes[product.id] = (prevIndexes[product.id] + 1) % product.hinhAnh.length || 0;
          }
        });
        return newIndexes;
      });
    }, 3000); // Chuyển ảnh sau mỗi 3 giây
    return () => clearInterval(interval);
  }, [hoaDon?.listDanhSachSanPham]);

  const currentStep = hoaDon ? steps.indexOf(hoaDon.trangThai) : -1; //Biến lưu index trạng thái hiện tại của hóa đơn trong steps
  const isCanceled = hoaDon?.trangThai === "Đã hủy";//Biến true false có phải hóa đơn trạng thái Hủy không
  return (
    <div>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(`/donMua`)} sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Đơn mua{" "}
          <Box component="span" sx={{ color: "#b0b0b0", fontWeight: "bold" }} >
            / Chi tiết hóa đơn {hoaDon.ma}
          </Box>
        </Typography>
      </Box>
      {/* Trạng thái hóa đơn */}
      <Box sx={{ textAlign: "center", maxWidth: "100%", mb: 3, display: "flex", justifyContent: "center" }}>
        {hoaDon.trangThai === "Đã hủy" ? (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "error.dark",
              bgcolor: "#FFEBEE",
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(211, 47, 47, 0.2)",
              display: "inline-block",
              maxWidth: "90%",
            }}
          >
            🚫 Hóa đơn này đã bị hủy!
          </Typography>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", overflow: "hidden" }}>
              <Box
                ref={scrollRef}
                onWheel={handleWheel}
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": { height: 4 },
                  "&::-webkit-scrollbar-thumb": { bgcolor: "grey.400", borderRadius: 2 },
                  width: "100%",
                  maxWidth: "1200px", // Giới hạn chiều rộng tối đa để không kéo cả trang
                  p: 1,
                  whiteSpace: "nowrap",
                  alignItems: "center",
                }}
              >

                {steps.map((step, index) => {
                  const isPast = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isSameStatus = step === steps[currentStep]; // Kiểm tra trùng trạng thái                
                  return (
                    <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                      <Chip
                        label={step}
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          fontWeight: isCurrent ? 700 : 500,
                          bgcolor: isSameStatus ? "#3498EA" : isPast ? "success.main" : isCurrent ? "warning.main" : "grey.300",
                          color: "white",
                          transition: "0.3s",
                          boxShadow: isCurrent ? "0px 2px 8px rgba(78, 172, 235, 0.16)" : "none",
                        }}
                      />
                      {index < steps.length - 1 && (
                        <Box
                          sx={{
                            width: 30,
                            height: 3,
                            bgcolor: isPast ? "success.light" : "grey.400",
                            mx: 1,
                            transition: "0.3s",
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </>)}
      </Box>
      {/* Thông tin hóa đơn */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          {/* Cột 1: Thông tin hóa đơn */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1976D2" }}>
              Thông tin hóa đơn {hoaDon.ma}
            </Typography>

            <Typography>
              <b>Trạng thái:</b>{" "}
              <Box
                component="span"
                sx={{
                  ...getStatusStyles(hoaDon.trangThai),
                  borderRadius: "8px",
                  padding: "4px 10px",
                  fontWeight: "normal",
                  display: "inline-block",
                  ml: 1,
                }}
              >
                {hoaDon.trangThai}
              </Box>
            </Typography>



            <Typography>
              <b>Ghi chú:</b> {hoaDon.ghiChu}
            </Typography>
          </Grid>

          {/* Cột 2: Thông tin nhận hàng */}
          {hoaDon.sdtNguoiNhanHang && (
            <Grid item xs={12} md={6}>
              <Typography variant="h7" gutterBottom sx={{ fontWeight: "bold", color: "#E65100" }}>
                Thông tin nhận hàng
              </Typography>
              <Typography>
                <b>Tên người nhận:</b> {hoaDon.tenNguoiNhanHang}
              </Typography>
              <Typography>
                <b>SDT người nhận:</b> {hoaDon.sdtNguoiNhanHang}
              </Typography>
              <Typography>
                <b>Email người nhận:</b> {hoaDon.emailNguoiNhanHang}
              </Typography>
              <Typography>
                <b>Địa chỉ người nhận:</b> {hoaDon.diaChiNguoiNhanHang}
              </Typography>
            </Grid>
          )
          }

          {/* Dòng mới: Thông tin khách hàng */}
          <Grid item xs={12}>
            <Typography variant="h7" gutterBottom sx={{ fontWeight: "bold", color: "#388E3C", mt: 2 }}>
              Thông tin khách hàng
            </Typography>
            <Typography>
              <Box sx={{
                backgroundColor: "#D1E8FF",
                color: "#0D47A1",
                borderRadius: "8px",
                padding: "4px 10px",
                fontWeight: "normal",
                display: "inline-block",

              }}>
                {hoaDon.maKhachHang ?
                  `${hoaDon.maKhachHang} - ${hoaDon.tenKhachHang} - ${hoaDon.sdtKhachHang}` : "Khách vãng lai"}
              </Box>

            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "1.2rem", flex: 1, textAlign: "center" }}
          >
            Danh sách sản phẩm
          </Typography>

        </Box>

        <Table sx={{ border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>STT</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Hình ảnh</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Sản phẩm</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số lượng</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Đơn giá</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hoaDon?.listDanhSachSanPham?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 2, fontStyle: "italic", color: "gray" }}>
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              hoaDon?.listDanhSachSanPham?.map((product, index) => {
                const images = product.hinhAnh || [];
                const currentIndex = imageIndexes[product.id] ?? 0;
                return (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: product.trangThai !== "Hoạt động" ? "#FFEBEE" : "inherit", // Màu đỏ nhạt nếu không hoạt động
                      "&:hover": { backgroundColor: product.trangThai !== "Hoạt động" ? "#FFCDD2" : "#f5f5f5" } // Màu hover khác nhau
                    }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">
                      {images.length > 0 && (
                        <img
                          src={images[currentIndex]}
                          alt={`Ảnh ${currentIndex + 1}`}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            transition: "transform 0.3s ease-in-out",
                            boxShadow: "0px 0px 8px rgba(0,0,0,0.15)",
                          }}
                          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography>{product.tenMauSize}</Typography>
                      <Typography sx={{ color: "gray", fontSize: "0.85rem" }}>{product.maSanPhamChiTiet}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" alignItems="center">

                        <TextField
                          value={product.soLuong}
                          type="number"
                          inputProps={{ min: 1, style: { textAlign: "center" }, step: 1 }}
                          size="small"
                          sx={{
                            width: "60px",
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              padding: "5px 0",
                              backgroundColor: "transparent"
                            },
                            "& .MuiOutlinedInput-root": {
                              border: "none",
                              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" }
                            },
                            "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",
                              margin: 0
                            }
                          }}
                        />

                      </Box>
                    </TableCell>
                    <TableCell align="center">{product.donGia?.toLocaleString()} VNĐ</TableCell>
                    <TableCell align="center">{product.soTien?.toLocaleString()} VNĐ</TableCell>

                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2, borderRadius: 2 }}>
        {/* Tổng tiền hàng */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1" fontWeight={500}>Tổng tiền hàng:</Typography>
          <Typography variant="body1" fontWeight={500}>{hoaDon.tongTienSanPham?.toLocaleString()} VNĐ</Typography>
        </Box>

        {/* Phí ship */}
        {(hoaDon?.phiVanChuyen ?? 0) > 0 && (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1" fontWeight={500}>Phí vận chuyển:</Typography>
            <Typography variant="body1" fontWeight={500}>{(hoaDon?.phiVanChuyen ?? 0).toLocaleString()} đ</Typography>
          </Box>
        )}

        {/* Mã voucher */}
        {hoaDon.maVoucher && (
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body1" fontWeight={500}>Mã giảm giá:</Typography>
            <Typography variant="body1" fontWeight={500} color="error">
              {hoaDon.maVoucher} - {(hoaDon.tongTienSanPham + (hoaDon?.phiVanChuyen ?? 0) - (hoaDon?.tongTienThanhToan ?? 0)).toLocaleString()} đ
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Tổng tiền thanh toán */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" color="primary">
            Tổng thanh toán:
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: "#D32F2F",
              // textShadow: "0px 0px 5px rgba(211, 47, 47, 0.5)",
            }}
          >
            {(hoaDon.tongTienThanhToan ?? 0).toLocaleString()} VNĐ
          </Typography>
        </Box>
      </Box>
      <ToastContainer /> {/* Quan trọng để hiển thị toast */}
    </div>
  );
};

export default HoaDonChiTietClient;
