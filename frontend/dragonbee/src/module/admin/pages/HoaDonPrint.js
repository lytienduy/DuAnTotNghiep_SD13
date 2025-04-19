import React, { forwardRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Container,
} from "@mui/material";

const hoaDonPrint = forwardRef(({ hoaDon }, ref) => {
  return (
    <Container sx={{ textAlign: "center" }}>
      <Box
        ref={ref}
        p={3}
        width="600px"
        mx="auto"
        border="1px solid #ddd"
        borderRadius={2}
        bgcolor="#fff"
      >
        {/* Logo + tên shop */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          {/* Logo bên trái */}
          <Box>
            <img
              src="https://raw.githubusercontent.com/lytienduy/DuAnTotNghiep_SD13/refs/heads/main/frontend/dragonbee/src/img/dragonbee_logo_v1.png"
              alt="Logo cửa hàng"
              style={{
                height: "60px",
                maxWidth: "100px",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Thông tin shop bên phải */}
          <Box textAlign="right" sx={{ flex: 1, ml: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              SHOP QUẦN ÂU DRAGONBEE
            </Typography>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Địa chỉ: 123 Nguyễn Trãi, Thanh Xuân, Hà Nội
            </Typography>
            <Typography sx={{ fontSize: "0.9rem" }}>
              SĐT: 0987 654 321
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Mã hóa đơn */}
        <Typography variant="h6" gutterBottom>
          HÓA ĐƠN BÁN HÀNG - Mã: {hoaDon?.ma}
        </Typography>

        {/* Thông tin nhận hàng */}
        {hoaDon?.sdtNguoiNhanHang && (
          <Box mb={2} textAlign="left">
            <Typography fontWeight="bold">Thông tin người nhận:</Typography>
            <Typography>Họ tên: {hoaDon?.tenNguoiNhanHang}</Typography>
            <Typography>SĐT: {hoaDon?.sdtNguoiNhanHang}</Typography>
            <Typography>Email: {hoaDon?.emailNguoiNhanHang}</Typography>
            <Typography>Địa chỉ: {hoaDon?.diaChiNguoiNhanHang}</Typography>
          </Box>
        )}

        {/* Thông tin khách hàng */}
        {hoaDon?.maKhachHang && (
          <Box textAlign="left" mb={2}>
            <Typography>
              <strong>Khách hàng:</strong> {hoaDon?.tenKhachHang} -{" "}
              {hoaDon?.sdtKhachHang}
            </Typography>
          </Box>
        )}

        {/* Ngày tạo */}
        <Typography textAlign="left" mb={2}>
          <strong>Ngày tạo:</strong>{" "}
          {new Date(hoaDon?.ngayTao)?.toLocaleString("vi-VN")}
        </Typography>

        {/* Bảng sản phẩm */}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Sản phẩm</TableCell>
                <TableCell align="center">Đơn giá</TableCell>
                <TableCell align="center">Số lượng</TableCell>
                <TableCell align="center">Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hoaDon?.listDanhSachSanPham?.length > 0 ? (
                hoaDon.listDanhSachSanPham.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">
                      <Typography>{product.tenMauSize}</Typography>
                      <Typography sx={{ color: "gray", fontSize: "0.8rem" }}>
                        {product.maSanPhamChiTiet}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {product.donGia?.toLocaleString()}₫
                    </TableCell>
                    <TableCell align="center">{product.soLuong}</TableCell>
                    <TableCell align="center">
                      {product.soTien?.toLocaleString()}₫
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Tổng kết */}
        <Box mt={3} textAlign="right">
          <Typography>
            <strong>Tổng tiền hàng:</strong>{" "}
            {hoaDon?.tongTienSanPham?.toLocaleString()}₫
          </Typography>

          {hoaDon?.phiVanChuyen && (
            <Typography>
              <strong>Phí vận chuyển:</strong>{" "}
              {hoaDon?.phiVanChuyen?.toLocaleString()}₫
            </Typography>
          )}

          {hoaDon?.maVoucher && (
            <Typography>
              <strong>Mã giảm giá:</strong> {hoaDon?.maVoucher} -{" "}
              {(
                hoaDon?.tongTienSanPham +
                hoaDon?.phiVanChuyen -
                hoaDon?.tongTienThanhToan
              )?.toLocaleString()}
              ₫
            </Typography>
          )}

          <Divider sx={{ my: 1 }} />

          <Typography variant="h6" color="error" fontWeight="bold">
            Tổng thanh toán: {hoaDon?.tongTienThanhToan?.toLocaleString()} VNĐ
          </Typography>
        </Box>

        {/* Footer */}
        <Divider sx={{ my: 2 }} />
        <Typography fontStyle="italic" sx={{ fontSize: "0.9rem" }}>
          Cảm ơn quý khách đã mua hàng!
        </Typography>
      </Box>
    </Container>
  );
});

export default hoaDonPrint;
