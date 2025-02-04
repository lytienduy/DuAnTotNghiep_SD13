import React, { useEffect, useState, useRef } from "react";
import axios from "axios";  // Đảm bảo bạn đã cài đặt axios
import { Select, MenuItem } from "@mui/material";  // Thêm import cần thiết
import { useNavigate } from "react-router-dom";
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ThemPhieuGiamGia = () => {
  const [type, setType] = useState("public");  // Kiểm tra kiểu: công khai hoặc cá nhân
  const [selectedCustomers, setSelectedCustomers] = useState([]);  // Danh sách khách hàng được chọn
  const [selectAll, setSelectAll] = useState(false);  // Checkbox "Chọn tất cả"
  const [customers, setCustomers] = useState([]);  // Dữ liệu khách hàng từ API
  const [selectedIcon, setSelectedIcon] = useState("percent");
  const [page, setPage] = useState(0);  // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(5);  // Số dòng trên mỗi trang
  const [totalItems, setTotalItems] = useState(0);  // Tổng số bản ghi
  const [soLuong, setSoLuong] = useState(null);  // Giá trị khởi tạo là null
  const navigate = useNavigate(); // Tạo biến navigate để điều hướng
  // Tạo các ref cho các input
  const maRef = useRef();
  const tenPhieuGiamGiaRef = useRef();
  const giaTriRef = useRef();
  const soLuongRef = useRef();
  const dieuKienRef = useRef();
  const giaTriToiDaRef = useRef();
  const tuNgayRef = useRef();
  const denNgayRef = useRef();

// Hàm xử lý quay lại trang trước
const handleBack = () => {
  navigate("/phieu-giam-gia"); // Điều hướng về trang phiếu giảm giá
};

  // Add phiếu giảm giá
  const handleAddNewCoupon = async () => {
    try {
      const ma = maRef.current ? maRef.current.value : "";
      const tenPhieuGiamGia = tenPhieuGiamGiaRef.current ? tenPhieuGiamGiaRef.current.value : "";
      const giaTriGiam = giaTriRef.current ? parseFloat(giaTriRef.current.value) : 0;
      const dieuKien = dieuKienRef.current ? parseFloat(dieuKienRef.current.value) : 0;
      const giaTriToiDa = giaTriToiDaRef.current ? parseFloat(giaTriToiDaRef.current.value) : 0;
      const tuNgay = tuNgayRef.current ? tuNgayRef.current.value : "";
      const denNgay = denNgayRef.current ? denNgayRef.current.value : "";
    
      const formattedNgayBatDau = tuNgay ? new Date(tuNgay).toISOString() : null;
      const formattedNgayKetThuc = denNgay ? new Date(denNgay).toISOString() : null;

      // Kiểm tra các trường bắt buộc
      if (!ma || !tenPhieuGiamGia || !formattedNgayBatDau || !formattedNgayKetThuc) {
        alert("Các trường bắt buộc không được để trống!");
        return;
      }
    
      // Kiểm tra kiểu và tính số lượng
      let khachHangIds = [];
      let soLuong = 0;  // Số lượng mặc định
    
      if (type === "private" && selectedCustomers.length > 0) {
        khachHangIds = selectedCustomers.map(customer => customer.id);  // Lấy ID khách hàng
        soLuong = selectedCustomers.length;  // Số lượng khách hàng được chọn
      } else if (type === "private" && selectedCustomers.length === 0) {
        alert("Vui lòng chọn khách hàng!");
        return;
      } else if (type === "public") {
        soLuong = soLuongRef.current ? parseInt(soLuongRef.current.value, 10) : 0;  // Số lượng nhập tay cho kiểu công khai
      }
    
      // Chuẩn bị dữ liệu gửi lên server
      const requestData = {
        ma: ma,
        tenPhieuGiamGia: tenPhieuGiamGia,
        loaiPhieuGiamGia: selectedIcon === "percent" ? "Phần trăm" : "Cố định",
        kieuGiamGia: type === "public" ? "Công khai" : "Cá nhân",
        giaTriGiam: giaTriGiam,
        soTienToiThieu: dieuKien,
        soTienGiamToiDa: giaTriToiDa,
        ngayBatDau: formattedNgayBatDau,
        ngayKetThuc: formattedNgayKetThuc,
        soLuong: soLuong,  // Sử dụng số lượng tính toán
        moTa: "Mô tả phiếu giảm giá",
        khachHangIds: khachHangIds,  // Gửi danh sách ID khách hàng nếu kiểu là "Cá nhân"
      };
    
      // Gọi API để thêm mới phiếu giảm giá
      const response = await axios.post("http://localhost:8080/dragonbee/add-phieu-giam-gia", requestData);
    
      // Kiểm tra phản hồi thành công
      if (response.status === 200) {
        alert("Thêm mới phiếu giảm giá thành công!");
        navigate("/phieu-giam-gia"); // Điều hướng về trang danh sách phiếu giảm giá
      }
    } catch (error) {
      console.error("Lỗi khi thêm mới phiếu giảm giá:", error.response?.data || error);
      alert("Thêm mới phiếu giảm giá thất bại!");
    }
  };
  
  
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
      setSelectedCustomers(customers);  // Chọn tất cả đối tượng khách hàng
    } else {
      setSelectedCustomers([]);  // Bỏ chọn tất cả
    }
  };
  
  
  // Xử lý chọn từng khách hàng
  const handleSelectCustomer = (id) => {
    const selectedCustomer = customers.find(customer => customer.id === id);
    
    if (selectedCustomers.includes(selectedCustomer)) {
      // Bỏ chọn khách hàng
      setSelectedCustomers(selectedCustomers.filter(customer => customer !== selectedCustomer));
    } else {
      // Chọn khách hàng
      setSelectedCustomers([...selectedCustomers, selectedCustomer]);
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
  <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleBack} sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
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
      inputRef={maRef}
      variant="outlined"
      size="small"
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Tên phiếu giảm giá"
      inputRef={tenPhieuGiamGiaRef}
      variant="outlined"
      size="small"
      fullWidth
      sx={{ mb: 2 }}
    />
   
   <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TextField
        label="Giá trị"
        inputRef={giaTriRef}
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
        label="Giá trị giảm tối đa"
        inputRef={giaTriToiDaRef}
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
        disabled={selectedIcon === "dollar"}  // Disable input if icon is dollar
      />
    </Box>

    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
    <TextField
  label="Số lượng"
  inputRef={soLuongRef}
  type="number"
  variant="outlined"
  size="small"
  fullWidth
  value={type === "private" ? selectedCustomers.length : (soLuong !== null ? soLuong : "")}  // Hiển thị trống nếu soLuong là null
  disabled={type === "private"}  // Khi chọn "Cá nhân" thì vô hiệu hóa trường số lượng
  onChange={(e) => {
    if (type === "public") {
      setSoLuong(e.target.value);  // Cập nhật số lượng khi kiểu "Công khai"
    }
  }}
  InputProps={{
    style: {
      textAlign: 'right', // Căn chỉnh văn bản bên phải
    }
  }}
/>



      <TextField
        label="Điều kiện"
        inputRef={dieuKienRef}
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
        inputRef={tuNgayRef}
        type="date"
        size="small"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Đến ngày"
        inputRef={denNgayRef}
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
                  checked={selectedCustomers.includes(customer)}  // So sánh đối tượng khách hàng
                  onChange={() => handleSelectCustomer(customer.id)}  // Cập nhật khi chọn hoặc bỏ chọn
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
      onClick={handleAddNewCoupon}  // Thêm sự kiện gọi API
    >
      Thêm Mới
    </Button>

  </Box>
</Box>



    </Box>
  );
};

export default ThemPhieuGiamGia;
