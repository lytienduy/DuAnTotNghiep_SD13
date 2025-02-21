import React, { forwardRef } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Container } from "@mui/material";

const HoaDonPrint = forwardRef(({ hoaDon }, ref) => {
  return (
    <Container sx={{ textAlign: "center" }}>
      <Box ref={ref} p={3} width="500px">
        <Typography variant="h4" align="center">
          Shop Quần Âu DRAGONBEE
        </Typography>
        <Typography variant="h5">Mã hóa đơn: {hoaDon.ma}</Typography>
        {/* <Typography variant="body1"><strong>Khách hàng nhận hàng:</strong> {hoaDon.tenNguoiNhanHang} - {hoaDon.sdtNguoiNhanHang}</Typography> */}
        {hoaDon.sdtNguoiNhanHang && (
          <Box item xs={12} md={6}>
            <Typography variant="h5"><strong>Thông tin nhận hàng</strong> </Typography>
            <Typography component="p" sx={{ fontSize: "1.5rem" }}>
              Người nhận: {hoaDon.tenNguoiNhanHang} - {hoaDon.sdtNguoiNhanHang} - {hoaDon.emailNguoiNhanHang}
            </Typography>
            <Typography component="p" sx={{ fontSize: "1.5rem" }}>
              Địa chỉ: {hoaDon.diaChiNguoiNhanHang}
            </Typography>
          </Box>
        )}
        {hoaDon.maKhachHang && (<Typography sx={{ fontSize: "1.5rem" }}>
          <Typography component="span" variant="h5">Khách hàng:</Typography> {hoaDon.tenKhachHang} {hoaDon.sdtKhachHang}
        </Typography>
        )}

        <Typography sx={{ fontSize: "1.5rem" }}>
          <Typography component="span" variant="h5">Ngày tạo:</Typography> {new Date(hoaDon.ngayTao).toLocaleString("vi-VN")}
        </Typography>


        <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
          <Typography
            variant="h5"
            gutterBottom
            align="center"
          >
            Danh sách sản phẩm
          </Typography>
          <Table sx={{ border: "1px solid #ddd" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>#</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>Sản phẩm</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>Đơn giá</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>Số lượng</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>Số tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {hoaDon.listDanhSachSanPham.length > 0 ? (
                hoaDon.listDanhSachSanPham.map((product, index) => {
                  return (
                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                      <TableCell align="center" sx={{ fontSize: "1.5rem" }}>{index + 1}</TableCell>
                      <TableCell align="center" sx={{ fontSize: "1.5rem" }}>
                        <Typography sx={{}}>{product.tenMauSize}</Typography>
                        <Typography sx={{ color: "gray", fontSize: "0.85rem" }}>{product.maSanPhamChiTiet}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "1.5rem" }}>{product.donGia.toLocaleString()}₫</TableCell>
                      <TableCell align="center" sx={{ fontSize: "1.5rem" }}>{product.soLuong}</TableCell>
                      <TableCell align="center" sx={{ fontSize: "1.5rem" }}>{product.soTien.toLocaleString()}₫</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 2, fontStyle: "italic", color: "gray" }}>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, borderRadius: 2 }}>
          {/* Tổng tiền hàng */}

          <Typography sx={{ fontSize: "1.5rem" }}>
            <Typography component="span" variant="h5">Tổng tiền hàng:</Typography> {` ${hoaDon.tongTienSanPham.toLocaleString()} đ`}
          </Typography>




          {hoaDon.phiVanChuyen && (
            <Typography sx={{ fontSize: "1.5rem" }}>
              <Typography component="span" variant="h5">Phí vận chuyển:</Typography> {` ${hoaDon.phiVanChuyen.toLocaleString()} đ`}
            </Typography>)}



          {/* Mã voucher */}
          {hoaDon.maVoucher && (
            <Typography variant="h5" fontWeight={500}>
              <strong>Mã giảm giá:</strong>   {hoaDon.maVoucher} - {(hoaDon.tongTienSanPham + hoaDon.phiVanChuyen - hoaDon.tongTienThanhToan).toLocaleString()} đ
            </Typography>
          )
          }

          <Divider sx={{ my: 2 }} />

          {/* Tổng tiền thanh toán */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" color="primary">
              Tổng thanh toán:
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: "#D32F2F",
              }}
            >
              {(hoaDon.tongTienSanPham + hoaDon.phiVanChuyen).toLocaleString()} VNĐ
            </Typography>
          </Box>

        </Box>
      </Box>
    </Container>
  );
});

export default HoaDonPrint;
