import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Slider,
} from "@mui/material";

const SanPhamChiTiet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chiTietList, setChiTietList] = useState([]); // Khởi tạo mặc định là mảng trống
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    trangThai: "",
    thuongHieu: "",
    danhMuc: "",
    phongCach: "",
    chatLieu: "",
    xuatXu: "",
    mauSac: "",
    size: "",
    kieuDang: "",
    kieuDaiQuan: "",
    priceRange: [100000, 5000000],
  });

  const [showAllDetails, setShowAllDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/sanpham/${id}/chi-tiet`,
          {
            params: showAllDetails
              ? { page: page - 1, size: 5 } // Hiển thị toàn bộ có phân trang
              : {}, // Hiển thị danh sách ban đầu không phân trang
          }
        );

        if (showAllDetails) {
          setChiTietList(response.data.content || []);
          setTotalPages(response.data.totalPages || 0);
        } else {
          setChiTietList(response.data || []);
          setTotalPages(0); // Ẩn phân trang khi không có phân trang
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết:", error);
        setChiTietList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showAllDetails, page]);

  const handleShowAllToggle = () => {
    setShowAllDetails(!showAllDetails);
    setPage(1); // Reset về trang 1 khi thay đổi chế độ
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (event, newValue) => {
    setFilters({ ...filters, priceRange: newValue });
  };

  // Kiểm tra chiTietList có phải là mảng và lọc dữ liệu hợp lý
  const filteredData = (Array.isArray(chiTietList) ? chiTietList : []).filter(
    (item) =>
      item.tenSanPham.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.trangThai === "" || item.trangThai === filters.trangThai) &&
      (filters.thuongHieu === "" || item.thuongHieu === filters.thuongHieu) &&
      (filters.danhMuc === "" || item.danhMuc === filters.danhMuc) &&
      (filters.phongCach === "" || item.phongCach === filters.phongCach) &&
      (filters.chatLieu === "" || item.chatLieu === filters.chatLieu) &&
      (filters.xuatXu === "" || item.xuatXu === filters.xuatXu) &&
      (filters.mauSac === "" || item.mauSac === filters.mauSac) &&
      (filters.size === "" || item.size === filters.size) &&
      (filters.kieuDang === "" || item.kieuDang === filters.kieuDang) &&
      (filters.kieuDaiQuan === "" ||
        item.kieuDaiQuan === filters.kieuDaiQuan) &&
      item.gia >= filters.priceRange[0] &&
      item.gia <= filters.priceRange[1]
  );

  const fieldLabels = {
    thuongHieu: "Thương Hiệu",
    danhMuc: "Danh Mục",
    phongCach: "Phong Cách",
    chatLieu: "Chất Liệu",
    xuatXu: "Xuất Xứ",
    mauSac: "Màu Sắc",
    size: "Kích Cỡ",
    kieuDang: "Kiểu Dáng",
    kieuDaiQuan: "Kiểu Đai Quần",
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Chi Tiết Sản Phẩm</Typography>
        <Grid>
          <Button variant="contained" color="primary">
            Sửa
          </Button>
        </Grid>
      </Grid>
      <Button color="black" sx={{ mr: 2 }} onClick={() => navigate("/sanpham")}>
        <ArrowBack />
      </Button>

      {/* Bộ lọc */}
      <Paper sx={{ padding: 2, mb: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Tìm kiếm theo tên"
              variant="outlined"
              fullWidth
              size="small"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>

          {Object.keys(fieldLabels).map((field) => (
            <Grid item xs={6} md={2} key={field}>
              <FormControl fullWidth size="small">
                <Typography variant="caption">{fieldLabels[field]}</Typography>
                <Select
                  name={field}
                  value={filters[field]}
                  onChange={handleFilterChange}
                  displayEmpty
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {Array.isArray(chiTietList) &&
                    chiTietList.length > 0 &&
                    Array.from(
                      new Set(chiTietList.map((item) => item[field]))
                    ).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          ))}

          <Grid item xs={5} md={3}>
            <Typography variant="body2">
              Khoảng giá: {filters.priceRange[0].toLocaleString()} VNĐ -{" "}
              {filters.priceRange[1].toLocaleString()} VNĐ
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={100000}
              max={5000000}
              step={100000}
              sx={{ mt: -1 }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        onClick={handleShowAllToggle}
        sx={{ mb: 2 }}
      >
        {showAllDetails
          ? "Ẩn Toàn Bộ Sản Phẩm Chi Tiết"
          : "Hiển Thị Toàn Bộ Sản Phẩm Chi Tiết"}
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>STT</strong>
                </TableCell>
                <TableCell>
                  <strong>Mã SP Chi Tiết</strong>
                </TableCell>
                <TableCell>
                  <strong>Tên Sản Phẩm</strong>
                </TableCell>
                <TableCell>
                  <strong>Danh Mục</strong>
                </TableCell>
                <TableCell>
                  <strong>Thương Hiệu</strong>
                </TableCell>
                <TableCell>
                  <strong>Phong Cách</strong>
                </TableCell>
                <TableCell>
                  <strong>Chất Liệu</strong>
                </TableCell>
                <TableCell>
                  <strong>Màu Sắc</strong>
                </TableCell>
                <TableCell>
                  <strong>Kích Cỡ</strong>
                </TableCell>
                <TableCell>
                  <strong>Kiểu Dáng</strong>
                </TableCell>
                <TableCell>
                  <strong>Kiểu Đai Quần</strong>
                </TableCell>
                <TableCell>
                  <strong>Xuất Xứ</strong>
                </TableCell>
                <TableCell>
                  <strong>Số Lượng</strong>
                </TableCell>
                <TableCell>
                  <strong>Giá</strong>
                </TableCell>
                <TableCell>
                  <strong>Trạng Thái</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    Không có dữ liệu phù hợp
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.ma}</TableCell>
                    <TableCell>{item.tenSanPham}</TableCell>
                    <TableCell>{item.danhMuc}</TableCell>
                    <TableCell>{item.thuongHieu}</TableCell>
                    <TableCell>{item.phongCach}</TableCell>
                    <TableCell>{item.chatLieu}</TableCell>
                    <TableCell>{item.mauSac}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.kieuDang}</TableCell>
                    <TableCell>{item.kieuDaiQuan}</TableCell>
                    <TableCell>{item.xuatXu}</TableCell>
                    <TableCell>{item.soLuong}</TableCell>
                    <TableCell>{item.gia}</TableCell>
                    <TableCell>{item.trangThai}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Hiển thị phân trang */}
      {showAllDetails && totalPages > 1 && (
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          <Typography sx={{ mx: 2 }} variant="h6">
            {` ${page} ... ${totalPages}`}
          </Typography>
          <Button
            variant="outlined"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
          
        </Grid>
      )}
    </Container>
  );
};

export default SanPhamChiTiet;
