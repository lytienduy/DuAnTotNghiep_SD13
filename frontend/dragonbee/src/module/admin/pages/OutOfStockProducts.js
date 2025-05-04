import React, { useEffect, useState } from "react";
import axios from "axios";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
} from "@mui/material";

const OutOfStockProducts = () => {
  const [quantity, setQuantity] = useState(20);    // Ngưỡng số lượng
  const [page, setPage] = useState(1);            // Trang hiện tại
  const [pageSize, setPageSize] = useState(5);    // Số bản ghi mỗi trang
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gọi API phân trang
  const fetchProductsPaging = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/products/page-out-of-stock", {
        params: {
          quantity,  // ngưỡng
          page,      // trang
          pageSize,  // số bản ghi/trang
        },
      });
      // res.data = { data, currentPage, pageSize, totalPages, ... }
      setProducts(res.data.data);
      setPage(res.data.currentPage);
      setPageSize(res.data.pageSize);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phân trang:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsPaging();
  }, [quantity, page, pageSize]);

  // Đổi ngưỡng (quantity)
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    setPage(1); // reset về trang 1
  };

  // Đổi số bản ghi mỗi trang
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1); // reset về trang 1
  };

  // Đổi trang (Pagination)
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header: Tiêu đề và chọn ngưỡng */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Danh sách sản phẩm sắp hết hàng hôm nay
        </Typography>
        {/* Chọn ngưỡng (quantity) */}
        <FormControl size="small" sx={{ width: 120 }}>
          <InputLabel></InputLabel>
          <Select value={quantity} onChange={handleQuantityChange}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={35}>35</MenuItem>
            <MenuItem value={40}>40</MenuItem>
            <MenuItem value={45}>45</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Hiển thị dữ liệu */}
      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : products.length === 0 ? (
        <Box textAlign="center" p={4}>
          <img
            src="https://tse3.mm.bing.net/th?id=OIP.8Zww1kyLFW31npF4fA1umgHaDt"
            alt="No Data"
            width="300"
            style={{ marginBottom: 16 }}
          />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Ảnh sản phẩm</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Số lượng tồn</TableCell>
                  <TableCell>Giá bán</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((prod, index) => (
                  <TableRow key={index}>
                    <TableCell><strong>{index + 1}</strong></TableCell>
                    <TableCell>
                      {prod.anhSanPham ? (
                        <img
                          src={prod.anhSanPham}
                          alt="Ảnh"
                          style={{ width: 50, height: 50 }}
                        />
                      ) : (
                        "Không có ảnh"
                      )}
                    </TableCell>
                    <TableCell>{prod.moTaChiTiet}</TableCell>
                    <TableCell>{prod.soLuongTon}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(prod.giaSanPham)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Thanh phân trang + chọn số bản ghi */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            {/* Bên trái: Chọn số bản ghi */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Xem</Typography>
              <FormControl size="small">
                <Select value={pageSize} onChange={handlePageSizeChange}>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                </Select>
              </FormControl>
              <Typography>Sản phẩm </Typography>
            </Stack>

            {/* Bên phải: Pagination */}
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default OutOfStockProducts;
