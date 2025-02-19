import React, { forwardRef } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from "@mui/material";

const HoaDonPrint = forwardRef(({ hoaDon }, ref) => {
  if (!hoaDon) return null;

  return (
    <Box ref={ref} p={3} width="500px">
      <Typography variant="h6" align="center">
        Hóa Đơn Shop Quần Âu DRAGONBEE
      </Typography>
      <Typography variant="body1"><strong>Mã hóa đơn:</strong> {hoaDon.ma}</Typography>
      <Typography variant="body1"><strong>Khách hàng nhận hàng:</strong> {hoaDon.tenNguoiNhanHang} - {hoaDon.sdtNguoiNhanHang}</Typography>
      <Typography variant="body1"><strong>Khách hàng đặt hàng:</strong> {hoaDon.tenKhachHang} {hoaDon.sdtKhachHang}</Typography>
      <Typography variant="body1"><strong>Ngày tạo:</strong> 2025-02-18</Typography>

      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
        <Typography
          variant="h6"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", p: 2, fontSize: "1.2rem", textTransform: "uppercase" }}
        >
          Danh sách sản phẩm
        </Typography>
        <Table sx={{ border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>#</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Sản phẩm</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Đơn giá</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số lượng</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hoaDon.listDanhSachSanPham.length > 0 ? (
              hoaDon.listDanhSachSanPham.map((product, index) => {
                return (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">
                      <Typography sx={{}}>{product.tenMauSize}</Typography>
                    </TableCell>
                    <TableCell align="center">{product.donGia}₫</TableCell>
                    <TableCell align="center">{product.soLuong}</TableCell>
                    <TableCell align="center">{product.soTien}₫</TableCell>
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
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1" fontWeight={500}>Tổng tiền hàng:</Typography>
          <Typography variant="body1" fontWeight={500}>{hoaDon.tongTienHang} đ</Typography>
        </Box>

        {/* Phí ship */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1" fontWeight={500}>Phí vận chuyển:</Typography>
          <Typography variant="body1" fontWeight={500}>{hoaDon.phiVanChuyen} đ</Typography>
        </Box>

        {/* Mã voucher */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="body1" fontWeight={500}>Mã giảm giá:</Typography>
          <Typography variant="body1" fontWeight={500} color="error">
            {hoaDon.maVoucher}
          </Typography>
        </Box>

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

            }}
          >
            {hoaDon.tongTienHang + hoaDon.phiVanChuyen}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

export default HoaDonPrint;
