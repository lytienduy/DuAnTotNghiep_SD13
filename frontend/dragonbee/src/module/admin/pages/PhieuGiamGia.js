import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Pagination
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DiscountCoupons = () => {
  const navigate = useNavigate();

  // State lưu dữ liệu
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  // Hàm gọi API
  useEffect(() => {
    const fetchCoupons = async () => {
        try {
          const response = await axios.get("http://localhost:8080/dragonbee/phieu-giam-gia", {
            params: {
              page,
              size: rowsPerPage,
              sort: "ngayBatDau,desc",
            },
          });
      
          console.log("Dữ liệu API trả về:", response.data);  // Thêm log ở đây
      
          setData(response.data.content);
          setTotalItems(response.data.totalElements);
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
        }
      };
      

    fetchCoupons();  // Gọi hàm fetch dữ liệu
}, [page, rowsPerPage]);


  // Hàm xử lý phân trang
  const handleChangePage = (newPage) => {
    setPage(newPage);  // Nhận giá trị page đúng cho API (0-indexed)
  };
  

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);  // Quay lại trang đầu tiên khi thay đổi số lượng dòng
  };
  

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Phiếu Giảm Giá
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={() => alert("Xuất Excel")}
          >
            Xuất Excel
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "#1976D2",
              borderColor: "#1976D2",
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#e3f2fd",
                borderColor: "#1565c0",
                color: "#1565c0",
              },
            }}
            onClick={() => navigate("/them-phieu-giam-gia")}
          >
            + Tạo mới
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: 3,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Tìm phiếu giảm giá theo mã hoặc tên"
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "gray", marginRight: 1 }} />
            ),
          }}
        />
        <TextField
          label="Từ ngày"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Đến ngày"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <Select size="small" displayEmpty defaultValue="">
          <MenuItem value="">Kiểu</MenuItem>
          <MenuItem value="Cá nhân">Cá nhân</MenuItem>
          <MenuItem value="Công khai">Công khai</MenuItem>
        </Select>
        <Select size="small" displayEmpty defaultValue="">
          <MenuItem value="">Trạng thái</MenuItem>
          <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
          <MenuItem value="Kết thúc">Kết thúc</MenuItem>
          <MenuItem value="Chưa diễn ra">Chưa diễn ra</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Kiểu</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.ma}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{row.ma}</TableCell>
                <TableCell>{row.tenPhieuGiamGia}</TableCell>
                <TableCell>
                    <Chip
                    label={row.kieuGiamGia}
                    sx={{
                        bgcolor: row.kieuGiamGia === "Cá nhân" ? "#e3f2fd" : "#fce4ec",
                        color: row.kieuGiamGia === "Cá nhân" ? "#1976d2" : "#d81b60",
                    }}
                    />
                </TableCell>
                <TableCell>
                {row.formattedGiaTriGiam.replace(/(\d+)(\.\d+)?/, (match, intPart) => {
                    return parseInt(intPart, 10).toLocaleString('en-US');
                })}
                </TableCell>
                <TableCell>{row.soLuong}</TableCell>
                <TableCell>{row.ngayBatDau}</TableCell>
                <TableCell>{row.ngayKetThuc}</TableCell>
                <TableCell>
                  <Chip
                    label={row.trangThai}
                    sx={{
                      bgcolor:
                        row.trangThai === "Đang diễn ra"
                          ? "#e8f5e9"
                          : row.trangThai === "Đã kết thúc"
                          ? "#ffebee"
                          : "#fff8e1",
                      color:
                        row.trangThai === "Đang diễn ra"
                          ? "#2e7d32"
                          : row.trangThai === "Đã kết thúc"
                          ? "#c62828"
                          : "#f57c00",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ width: 150, whiteSpace: 'nowrap' }}>
                <IconButton onClick={() => navigate(`/detail-phieu-giam-gia/${row.ma}`)}>
                  <VisibilityIcon />
                </IconButton>
                  <IconButton onClick={() => alert(`Trạng thái của ${row.tenPhieuGiamGia} đã được chuyển đổi`)}>
                    <ChangeCircleIcon fontSize="large" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}  
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">Xem</Typography>
          <Select
            value={rowsPerPage}
            onChange={(e) => handleChangeRowsPerPage(e)}
            size="small"
            sx={{ minWidth: "60px" }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
          <Typography variant="body2">sản phẩm</Typography>
        </Box>

        <Pagination
          count={Math.ceil(totalItems / rowsPerPage)}
          page={page + 1}  // Hiển thị trang với giá trị +1 cho người dùng
          onChange={(event, newPage) => handleChangePage(newPage - 1)}  // Chuyển đổi về 0-indexed cho API
          color="primary"
        />
      </Box>

    </Box>
  );
};

export default DiscountCoupons;
