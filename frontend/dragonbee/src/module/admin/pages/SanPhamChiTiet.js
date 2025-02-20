import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
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
  Box,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Pagination,
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
  const [openSnackbar, setOpenSnackbar] = useState(false); // Mở đóng Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Nội dung thông báo
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
  const [size, setSize] = useState(5); // Hoặc giá trị mặc định phù hợp

  const [showAllDetails, setShowAllDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Mặc định là 5 item mỗi trang
  const [selectedItems, setSelectedItems] = useState([]); // Dùng để lưu trữ các sản phẩm được chọn
  const [newQuantity, setNewQuantity] = useState(""); // Lưu trữ giá trị số lượng nhập vào
  const [newPrice, setNewPrice] = useState(""); // Lưu trữ giá trị giá nhập vào
  const fetchSanPhamChiTietById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/sanpham/by-san-pham/${id}`, {
        params: {
          page: page - 1,
          size: itemsPerPage,
        },
      });
      setChiTietList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết theo ID:", error);
    }
  };
  
  // Hàm tải mã QR cho sản phẩm chi tiết
  const handleDownloadQRCode = async (productDetailId) => {
    try {
      // Kiểm tra nếu sản phẩm chi tiết đã có trong chiTietList
      const productDetail = chiTietList.find(item => item.id === productDetailId);
      if (!productDetail) {
        alert("Sản phẩm chi tiết không tồn tại.");
        return;
      }
  
      // Lấy mã sản phẩm chi tiết
      const response = await axios.get(`http://localhost:8080/api/qr-code/${productDetailId}`, {
        responseType: 'arraybuffer', // Để nhận dữ liệu hình ảnh dưới dạng binary
      });
  
      const blob = new Blob([response.data], { type: 'image/png' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${productDetail.ma}.png`;  // Tên file là mã sản phẩm
      link.click();
    } catch (error) {
      console.error("Lỗi khi tải mã QR:", error);
      alert("Có lỗi khi tải mã QR.");
    }
  };
  
  // Hàm lấy tất cả sản phẩm chi tiết
  const fetchAllSanPhamChiTiet = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/sanpham/chi-tiet/all', {
        params: {
          page: page - 1,
          size: itemsPerPage,
        },
      });
      setChiTietList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết:", error);
    }
  };
  

  // useEffect để gọi API khi id, page, hoặc itemsPerPage thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!showAllDetails) {
          // Nếu không hiển thị toàn bộ sản phẩm, lấy theo ID sản phẩm cha
          await fetchSanPhamChiTietById(id);
        } else {
          // Nếu hiển thị toàn bộ, lấy tất cả sản phẩm chi tiết
          await fetchAllSanPhamChiTiet();
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết:", error);
        setChiTietList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, page, itemsPerPage, showAllDetails]); // Gọi lại khi id, page, itemsPerPage, showAllDetails thay đổi

  const handleShowAllToggle = () => {
    setShowAllDetails(!showAllDetails);
    setPage(1); // Khi đổi trạng thái, reset lại trang về 1

    setSnackbarMessage(
      !showAllDetails
        ? "Đang hiển thị toàn bộ sản phẩm chi tiết."
        : "Đã ẩn sản phẩm chi tiết."
    );
    setOpenSnackbar(true);
  };
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (event, newValue) => {
    setFilters({ ...filters, priceRange: newValue });
  };
  // Hàm xử lý thay đổi số lượng và giá
  const handleUpdateDetails = async () => {
    const updatedItems = selectedItems.map((item) => ({
      id: item.id,
      soLuong: newQuantity || item.soLuong, // Nếu không có số lượng mới, giữ nguyên
      gia: newPrice || item.gia, // Nếu không có giá mới, giữ nguyên
    }));

    try {
      const response = await axios.put(
        `http://localhost:8080/api/sanpham/${id}/chi-tiet/sua`,
        updatedItems
      );
      setSnackbarMessage("Cập nhật sản phẩm chi tiết thành công!");
      setOpenSnackbar(true);
      setSelectedItems([]); // Reset selected items after update
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm chi tiết:", error);
      setSnackbarMessage("Lỗi khi cập nhật sản phẩm chi tiết!");
      setOpenSnackbar(true);
    }
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };
  // Dowload QR
  


  // Kiểm tra chiTietList có phải là mảng và lọc dữ liệu hợp lý
  const filteredData = chiTietList.filter(
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateDetails}
          >
            Cập Nhật Sản Phẩm
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
      {/* Toggle Button */}
      <Grid container justifyContent="flex-end" spacing={1}>
  <Grid item>
    <Button
      variant="contained"
      onClick={handleShowAllToggle}
      sx={{
        backgroundColor: "lightblue",
        "&:hover": { backgroundColor: "lightblue" },
      }}
      startIcon={showAllDetails ? <VisibilityOff /> : <Visibility />}
    >
      {showAllDetails ? "Ẩn chi tiết" : "Hiển thị toàn bộ"}
    </Button>
  </Grid>
  
</Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
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
                <TableCell>Download QR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chiTietList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    Không có dữ liệu phù hợp
                  </TableCell>
                </TableRow>
              ) : (
                chiTietList.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </TableCell>
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
                    <TableCell>
                    <Button
    variant="contained"
    color="primary"
    onClick={() => handleDownloadQRCode(item.id)}
    sx={{
        backgroundColor: 'primary', // Màu xanh nhạt
        '&:hover': {
            backgroundColor: '#lightblue', // Màu khi di chuột vào (highlight)
            transform: 'scale(0.9)', // Kích thước nhỏ lại khi hover (giảm 10% kích thước)
            transition: 'transform 0.2s ease-in-out', // Thêm hiệu ứng chuyển động khi hover
        },
        padding: '6px 12px', // Giảm padding để làm button nhỏ hơn
        fontSize: '0.875rem', // Giảm kích thước chữ để button nhỏ gọn hơn
        borderRadius: '4px', // Thêm border radius nếu muốn
        boxShadow: 'none', // Tắt bóng đổ nếu không cần
        textTransform: 'none', // Tắt chữ in hoa nếu muốn
        minWidth: '120px', // Đặt chiều rộng tối thiểu cho button
    }}
>
    Download QR
</Button>


                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 2, p: 1, background: "#f1f1f1", borderRadius: "5px" }}
          >
            {/* Dropdown to select number of items per page */}
            <Box display="flex" alignItems="center">
              <Typography variant="body2" sx={{ mr: 1 }}>
                Xem
              </Typography>
              <Select
                value={size}
                onChange={(e) => {
                  setSize(e.target.value);
                  setPage(1); // Reset to first page
                }}
                size="small"
                sx={{ width: 70, backgroundColor: "white" }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
              <Typography variant="body2" sx={{ ml: 1 }}>
                sản phẩm
              </Typography>
            </Box>

            {/* Pagination controls */}
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              variant="outlined"
              shape="rounded"
              color="primary"
              siblingCount={0} // Keep it compact
              sx={{
                "& .MuiPaginationItem-root": {
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  "&.Mui-selected": {
                    backgroundColor: "lightblue",
                    color: "white",
                  },
                },
              }}
            />
          </Box>
        </>
        
      )}

      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Hiển thị ở góc phải trên
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default SanPhamChiTiet;
