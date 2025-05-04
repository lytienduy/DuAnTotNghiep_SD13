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

const HoaDonPrint = forwardRef(({ hoaDon }, ref) => {
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          className="invoice-header" // Đảm bảo thêm class để áp dụng CSS khi in
        >
          {/* Logo bên trái */}
          <Box>
            <img
              src="https://raw.githubusercontent.com/lytienduy/DuAnTotNghiep_SD13/refs/heads/main/frontend/dragonbee/src/img/dragonbee_logo_v1.png"
              alt="Logo cửa hàng"
              style={{
                height: "100px",
                maxWidth: "150px",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Thông tin cửa hàng bên phải */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            ml={2}
            className="invoice-info" // Đảm bảo thêm class để áp dụng CSS khi in
          >
            <Typography variant="h2" fontWeight="bold">
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
        <Typography variant="h2" gutterBottom>
          HÓA ĐƠN BÁN HÀNG - Mã: {hoaDon?.ma}
        </Typography>

        {/* Thông tin người nhận */}
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
        <TableContainer sx={{ mt: 2, border: "1px solid #000" }}>
          <Table style={{ borderCollapse: "collapse", width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ border: "1px solid black", textAlign: "center" }}
                >
                  #
                </TableCell>
                <TableCell
                  style={{ border: "1px solid black", textAlign: "center" }}
                >
                  Sản phẩm
                </TableCell>
                <TableCell
                  style={{ border: "1px solid black", textAlign: "center" }}
                >
                  Đơn giá
                </TableCell>
                <TableCell
                  style={{ border: "1px solid black", textAlign: "center" }}
                >
                  Số lượng
                </TableCell>
                <TableCell
                  style={{ border: "1px solid black", textAlign: "center" }}
                >
                  Thành tiền
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hoaDon?.listDanhSachSanPham?.length > 0 ? (
                hoaDon.listDanhSachSanPham.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{ border: "1px solid black", textAlign: "center" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid black", textAlign: "center" }}
                    >
                      <Typography>{product.tenMauSize}</Typography>
                      <Typography style={{ color: "gray", fontSize: "0.8rem" }}>
                        {product.maSanPhamChiTiet}
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid black", textAlign: "center" }}
                    >
                      {product.donGia?.toLocaleString()} VNĐ
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid black", textAlign: "center" }}
                    >
                      {product.soLuong}
                    </TableCell>
                    <TableCell
                      style={{ border: "1px solid black", textAlign: "center" }}
                    >
                      {product.soTien?.toLocaleString()} VNĐ
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Tổng kết */}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Box width="200px">
            <Typography textAlign="right">
              <strong>Tổng tiền hàng:</strong>{" "}
              {hoaDon?.tongTienSanPham?.toLocaleString()} VNĐ
            </Typography>

            {hoaDon?.phiVanChuyen && (
              <Typography textAlign="right">
                <strong>Phí vận chuyển:</strong>{" "}
                {hoaDon?.phiVanChuyen?.toLocaleString()} VNĐ
              </Typography>
            )}

            {hoaDon?.maVoucher && (
              <Typography textAlign="right">
                <strong>Mã giảm giá:</strong> {hoaDon?.maVoucher} -{" "}
                {(
                  hoaDon?.tongTienSanPham +
                  hoaDon?.phiVanChuyen -
                  hoaDon?.tongTienThanhToan
                )?.toLocaleString()}{" "}
                 VNĐ
              </Typography>
            )}

            <Divider sx={{ my: 1 }} />

            <Typography
              variant="h2"
              color="error"
              fontWeight="bold"
              textAlign="right"
            >
              Tổng thanh toán: {hoaDon?.tongTienThanhToan?.toLocaleString()} VNĐ
            </Typography>
          </Box>
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

export default HoaDonPrint;
