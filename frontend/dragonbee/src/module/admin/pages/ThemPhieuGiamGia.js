import React, { useEffect, useState } from "react";
import axios from "axios";  // Đảm bảo bạn đã cài đặt axios
import { Select, MenuItem } from "@mui/material";  // Thêm import cần thiết
import {
  Box,
  Button,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const ThemPhieuGiamGia = () => {
  const [type, setType] = useState("public");  // Kiểm tra kiểu: công khai hoặc cá nhân
  const [selectedCustomers, setSelectedCustomers] = useState([]);  // Danh sách khách hàng được chọn
  const [selectAll, setSelectAll] = useState(false);  // Checkbox "Chọn tất cả"
  const [customers, setCustomers] = useState([]);  // Dữ liệu khách hàng từ API
  const [selectedIcon, setSelectedIcon] = useState("percent");
  const [page, setPage] = useState(0);  // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(5);  // Số dòng trên mỗi trang
  const [totalItems, setTotalItems] = useState(0);  // Tổng số bản ghi

  // Hàm gọi API để lấy danh sách khách hàng
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/dragonbee/khach-hang", {
          params: {
            page,  // Giữ nguyên giá trị page (0-indexed)
            size: rowsPerPage,
          },
        });
        setCustomers(response.data.content);
        setTotalItems(response.data.totalElements);
      } catch (error) {
        console.error("Lỗi khi gọi API khách hàng:", error);
      }
    };
    
  
    fetchCustomers();  // Gọi hàm bên trong useEffect
  }, [page, rowsPerPage]);
  
  

  // Xử lý chọn tất cả
  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedCustomers(customers.map((customer) => customer.email));  // Chọn tất cả dựa trên email
    } else {
      setSelectedCustomers([]);
    }
  };

  // Xử lý chọn từng dòng
  const handleSelectCustomer = (email) => {
    if (selectedCustomers.includes(email)) {
      setSelectedCustomers(selectedCustomers.filter((customerEmail) => customerEmail !== email));
    } else {
      setSelectedCustomers([...selectedCustomers, email]);
    }
  };

  // Hàn xử lý sự kiện cho Pagination phân trang
  const handleChangePage = (newPage) => {
    setPage(newPage);  // Nhận giá trị page đúng cho API (0-indexed)
  };
  
  
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);  // Quay về trang đầu khi thay đổi số dòng
  };
  
  

  return (
    <Box sx={{ padding: 3, marginBot: "10px" }}> {/* Thêm khoảng cách từ header */}
  {/* Header */}
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
  <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
  Phiếu Giảm Giá{" "}
  <Box component="span" sx={{ color: "#b0b0b0", fontWeight: "bold" }}>
    / Tạo Phiếu Giảm Giá
  </Box>
</Typography>
</Box>

  {/* Form + Bảng khách hàng */}
  <Box
  sx={{
    display: "flex",
    gap: 3,
    alignItems: "flex-start",
    flexWrap: "nowrap",
    overflowX: "hidden",
    paddingTop: "10px",
  }}
>
  {/* Form sẽ giãn rộng khi không có bảng khách hàng */}
  <Box
    sx={{
      flex: type === "public" ? 1 : "0 0 40%", // Giãn hết cỡ nếu là "public", thu nhỏ khi là "private"
      maxWidth: type === "public" ? "100%" : "40%",
      minWidth: "300px",
      transition: "all 0.3s ease", // Thêm hiệu ứng chuyển đổi mượt mà
    }}
  >
    {/* Các thành phần form */}
    <TextField
      label="Mã phiếu giảm giá"
      variant="outlined"
      size="small"
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Tên phiếu giảm giá"
      variant="outlined"
      size="small"
      fullWidth
      sx={{ mb: 2 }}
    />
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TextField
        label="Giá trị"
        type="number"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setSelectedIcon("percent")}
                sx={{
                  color: selectedIcon === "percent" ? "#1976D2" : "#757575",
                }}
              >
                <PercentIcon />
              </IconButton>
              <IconButton
                onClick={() => setSelectedIcon("dollar")}
                sx={{
                  color: selectedIcon === "dollar" ? "#1976D2" : "#757575",
                }}
              >
                <AttachMoneyIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Giá trị tối đa"
        type="number"
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <AttachMoneyIcon style={{ color: "#1976D2" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>

    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TextField
        label="Số lượng"
        type="number"
        variant="outlined"
        size="small"
        fullWidth
      />
      <TextField
        label="Điều kiện"
        type="number"
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <AttachMoneyIcon style={{ color: "#1976D2" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>

    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TextField
        label="Từ ngày"
        type="date"
        size="small"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Đến ngày"
        type="date"
        size="small"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
    </Box>

    {/* Kiểu */}
    <Typography variant="body1" sx={{ mb: 1 }}>
      Kiểu
    </Typography>
    <RadioGroup row value={type} onChange={(e) => setType(e.target.value)}>
      <FormControlLabel value="public" control={<Radio />} label="Công khai" />
      <FormControlLabel value="private" control={<Radio />} label="Cá nhân" />
    </RadioGroup>
  </Box>

  {/* Bảng khách hàng */}
  {type === "private" && (
    <Box
    sx={{
      flex: "1 1 0%",  // Cho phép bảng khách hàng giãn đầy đủ
      maxWidth: "100%",  // Đặt chiều rộng tối đa 100%
      overflowX: "auto",
      minWidth: "500px",
    }}
  >
    <TextField
      placeholder="Tìm kiếm khách hàng"
      variant="outlined"
      size="small"
      fullWidth
      sx={{ mb: 2 }}
    />
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%", padding: "6px 8px" }}>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell sx={{ width: "20%", padding: "6px 8px" }}>
              <strong>Tên</strong>
            </TableCell>
            <TableCell sx={{ width: "20%", padding: "6px 8px" }}>
              <strong>Số điện thoại</strong>
            </TableCell>
            <TableCell sx={{ width: "30%", padding: "6px 8px" }}>
              <strong>Email</strong>
            </TableCell>
            <TableCell sx={{ width: "20%", padding: "6px 8px" }}>
              <strong>Ngày sinh</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.email} sx={{ height: "40px" }}>
              <TableCell sx={{ width: "5%", padding: "6px 8px" }}>
                <Checkbox
                  checked={selectedCustomers.includes(customer.email)}
                  onChange={() => handleSelectCustomer(customer.email)}
                  color="primary"
                />
              </TableCell>
              <TableCell sx={{ width: "20%", padding: "6px 8px" }}>
                {customer.tenKhachHang}
              </TableCell>
              <TableCell sx={{ width: "20%", padding: "6px 8px" }}>
                {customer.sdt}
              </TableCell>
              <TableCell sx={{ width: "30%", padding: "6px 8px" }}>
                <Typography sx={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
                  {customer.email}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: "20%", padding: "6px 8px" }}>
                {customer.ngaySinh}
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
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
        <Typography variant="body2">khách hàng</Typography>
      </Box>

      <Pagination
        count={Math.ceil(totalItems / rowsPerPage)}
        page={page + 1}  // Hiển thị trang với giá trị +1 cho người dùng
        onChange={(event, newPage) => handleChangePage(newPage - 1)}  // Truyền giá trị -1 khi gọi API
        color="primary"
      />


    </Box>

  </Box>
  )}
</Box>
<Box
  sx={{
    display: "flex",
    justifyContent: type === "public" ? "flex-start" : "flex-end", 
    mt: 3,
  }}
>
  <Box
    sx={{
      display: "flex",
      justifyContent: type === "public" ? "flex-start" : "flex-end",
      alignItems: "center",
      width: type === "private" ? "60%" : "100%", // Chỉ chiếm 60% nếu là "private"
      ml: type === "private" ? "auto" : "0",     // Dịch sang bên phải nếu là "private"
    }}
  >
    <Button
      variant="outlined"
      sx={{
        color: "#1976d2",
        borderColor: "#1976d2",
        backgroundColor: "#fff",
        "&:hover": {
          backgroundColor: "#e3f2fd",
          borderColor: "#1565c0",
          color: "#1565c0",
        },
        alignSelf: "flex-end",
      }}
      onClick={() =>
        alert(
          `Khách hàng được chọn: ${
            selectedCustomers.length
              ? selectedCustomers.join(", ")
              : "Không có khách hàng nào được chọn"
          }`
        )
      }
    >
      Thêm Mới
    </Button>
  </Box>
</Box>



    </Box>
  );
};

export default ThemPhieuGiamGia;
