import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
  Select,
  MenuItem
} from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DetailPhieuGiamGia = () => {
  const [type, setType] = useState("public");  // Kiểm tra kiểu: công khai hoặc cá nhân
  const [selectedCustomers, setSelectedCustomers] = useState([]);  // Danh sách khách hàng được chọn
  const [selectAll, setSelectAll] = useState(false);  // Checkbox "Chọn tất cả"
  const [customers, setCustomers] = useState([]);  // Dữ liệu khách hàng từ API
  const [selectedIcon, setSelectedIcon] = useState("percent");
  const [page, setPage] = useState(0);  // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(5);  // Số dòng trên mỗi trang
  const [totalItems, setTotalItems] = useState(0);  // Tổng số bản ghi
  const [soLuong] = useState(null);  // Giá trị khởi tạo là null
  const navigate = useNavigate(); // Tạo biến navigate để điều hướng
  const { ma } = useParams(); // Lấy mã phiếu giảm giá từ URL
  const [phieuGiamGia, setPhieuGiamGia] = useState(null);

  // Hàm xử lý quay lại trang trước
  const handleBack = () => {
    navigate("/phieu-giam-gia"); // Điều hướng về trang phiếu giảm giá
  };

  // Lấy chi tiết phiếu giảm giá từ API
  useEffect(() => {
    const fetchPhieuGiamGiaDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/dragonbee/detail-phieu-giam-gia/${ma}`);
        
        setPhieuGiamGia({
          ...response.data,
          giaTriGiamToiDa: response.data.giaTriGiamToiDa || "", // ✅ Gán giá trị rỗng nếu null
        });
  
        setSelectedIcon(response.data.loaiPhieuGiamGia === "Phần trăm" ? "percent" : "dollar");
  
        if (response.data.kieuGiamGia === "Cá nhân") {
          setType("private");
          setSelectedCustomers(response.data.khachHangIds || []);
        } else {
          setType("public");
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết phiếu giảm giá:", error);
      }
    };
  
    fetchPhieuGiamGiaDetail();
  }, [ma]);
  

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

  const handleChangeKieuGiamGia = (event) => {
    const newType = event.target.value;
  
    setType(newType);
  
    setPhieuGiamGia((prev) => ({
      ...prev,
      kieuGiamGia: newType, // ✅ Cập nhật kiểu trong state
    }));
  
    // Nếu chuyển từ Cá nhân -> Công khai, xóa danh sách khách hàng
    if (newType === "public") {
      setSelectedCustomers([]);
    }
  };  

  const handleUpdate = async () => {
    try {
      const updatedData = {
        tenPhieuGiamGia: phieuGiamGia.tenPhieuGiamGia,
        giaTriGiam: phieuGiamGia.giaTriGiam,
        loaiPhieuGiamGia: phieuGiamGia.loaiPhieuGiamGia,
        soTienGiamToiDa: selectedIcon === "percent" ? phieuGiamGia.giaTriGiamToiDa : null, // ✅ Chỉ gửi nếu là phần trăm
        soLuong: type === "private" ? selectedCustomers.length : phieuGiamGia.soLuong,
        soTienToiThieu: phieuGiamGia.soTienToiThieu,
        ngayBatDau: phieuGiamGia.ngayBatDau,
        ngayKetThuc: phieuGiamGia.ngayKetThuc,
        kieuGiamGia: type === "private" ? "Cá nhân" : "Công khai",
        khachHangIds: type === "private" ? selectedCustomers : [],
      };
  
      const response = await axios.put(
        `http://localhost:8080/dragonbee/update-phieu-giam-gia/${ma}`,
        updatedData
      );
  
      if (response.status === 200) {
        alert("Cập nhật phiếu giảm giá thành công!");
  
        setPhieuGiamGia((prev) => ({
          ...prev,
          ...updatedData,
        }));
  
        navigate("/phieu-giam-gia");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật phiếu giảm giá:", error);
      alert("Cập nhật phiếu giảm giá không thành công.");
    }
  };
  
  

  // Xử lý chọn tất cả
  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    
    if (event.target.checked) {
      setSelectedCustomers(customers.map(customer => customer.id));  // Chọn tất cả đối tượng khách hàng
    } else {
      setSelectedCustomers([]);  // Bỏ chọn tất cả
    }
  };

  // Xử lý chọn từng khách hàng
const handleSelectCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      // Bỏ chọn khách hàng
      setSelectedCustomers(selectedCustomers.filter((customerId) => customerId !== id));
    } else {
      // Chọn khách hàng
      setSelectedCustomers([...selectedCustomers, id]);
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
    <Box sx={{ padding: 3, marginBot: "10px" }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleBack} sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Phiếu Giảm Giá
          <Box component="span" sx={{ color: "#b0b0b0", fontWeight: "bold" }}>
            / Chi Tiết Phiếu Giảm Giá
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
          {phieuGiamGia && (
            <>
              <TextField
                label="Mã phiếu giảm giá"
                value={phieuGiamGia.ma}
                variant="outlined"
                size="small"
                fullWidth
                sx={{ mb: 2 }}
                disabled
              />
             <TextField
                label="Tên phiếu giảm giá"
                value={phieuGiamGia.tenPhieuGiamGia}
                variant="outlined"
                size="small"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => setPhieuGiamGia({
                  ...phieuGiamGia,
                  tenPhieuGiamGia: e.target.value,
                })}
              />
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {/* Giá trị */}
            <TextField
  label="Giá trị"
  value={phieuGiamGia.giaTriGiam}
  type="number"
  size="small"
  fullWidth
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => {
            setSelectedIcon("percent");
            setPhieuGiamGia((prev) => ({
              ...prev,
              loaiPhieuGiamGia: "Phần trăm", 
              giaTriGiamToiDa: prev.loaiPhieuGiamGia === "Cố định" ? "" : prev.giaTriGiamToiDa // Giữ giá trị khi là phần trăm
            }));
          }}
          sx={{
            color: selectedIcon === "percent" ? "#1976D2" : "#757575",
          }}
        >
          <PercentIcon />
        </IconButton>

        <IconButton
          onClick={() => {
            setSelectedIcon("dollar");
            setPhieuGiamGia((prev) => ({
              ...prev,
              loaiPhieuGiamGia: "Cố định", 
              giaTriGiamToiDa: "" // Xóa dữ liệu khi chọn "Cố định"
            }));
          }}
          sx={{
            color: selectedIcon === "dollar" ? "#1976D2" : "#757575",
          }}
        >
          <AttachMoneyIcon />
        </IconButton>
      </InputAdornment>
    ),
  }}
  onChange={(e) => setPhieuGiamGia({
    ...phieuGiamGia,
    giaTriGiam: e.target.value,
  })}
/>


  
            {/* Giá trị giảm tối đa */}
            <TextField
  label="Giá trị giảm tối đa"
  value={phieuGiamGia.giaTriGiamToiDa || ""} // ✅ Hiển thị giá trị từ API, nếu null thì rỗng
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
  disabled={selectedIcon === "dollar"} // ✅ Nếu chọn đô la thì bị disable
  onChange={(e) => {
    if (selectedIcon === "percent") {
      setPhieuGiamGia({
        ...phieuGiamGia,
        giaTriGiamToiDa: e.target.value,
      });
    }
  }}
/>

        </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    label="Số lượng"
                    value={type === "private" ? selectedCustomers.length : soLuong || phieuGiamGia?.soLuong || ""} // Sử dụng phieuGiamGia.soLuong khi kiểu là "Công khai" và selectedCustomers.length khi kiểu là "Cá nhân"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled={type === "private"} // Disable khi là "Cá nhân"
                    onChange={(e) => {
                      if (type === "public") {
                        // Cập nhật số lượng khi kiểu "Công khai"
                        const updatedSoLuong = e.target.value;
                        setPhieuGiamGia(prevState => ({
                          ...prevState,
                          soLuong: updatedSoLuong // Cập nhật trong phieuGiamGia
                        }));
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
                    value={phieuGiamGia.soTienToiThieu}
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
                    onChange={(e) => setPhieuGiamGia({
                      ...phieuGiamGia,
                      soTienToiThieu: e.target.value,
                    })}
                />
            </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Từ ngày"
          type="date"
          size="small"
          fullWidth
          value={phieuGiamGia.ngayBatDau ? phieuGiamGia.ngayBatDau.split('T')[0] : ''}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            const selectedDate = e.target.value;
            setPhieuGiamGia((prev) => ({
              ...prev,
              ngayBatDau: selectedDate + "T00:00:00", // ✅ Định dạng ISO 8601
            }));
          }}
        />

        <TextField
          label="Đến ngày"
          type="date"
          size="small"
          fullWidth
          value={phieuGiamGia.ngayKetThuc ? phieuGiamGia.ngayKetThuc.split('T')[0] : ''}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            const selectedDate = e.target.value;
            setPhieuGiamGia((prev) => ({
              ...prev,
              ngayKetThuc: selectedDate + "T23:59:59", // ✅ Định dạng ISO 8601
            }));
          }}
        />
        </Box>


              {/* Kiểu */}
              <Typography variant="body1" sx={{ mb: 1 }}>
                Kiểu
              </Typography>
              <RadioGroup row value={type} onChange={handleChangeKieuGiamGia}>
                <FormControlLabel value="public" control={<Radio />} label="Công khai" />
                <FormControlLabel value="private" control={<Radio />} label="Cá nhân" />
              </RadioGroup>

            </>
          )}
        </Box>

        {/* Bảng khách hàng */}
        {type === "private" && (
          <Box sx={{flex: "1 1 0%", maxWidth: "100%", overflowX: "auto", minWidth: "500px" }}>
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
                    <TableCell sx={{ padding: "6px 8px" }}>
                      <Checkbox checked={selectAll} onChange={handleSelectAll} color="primary" />
                    </TableCell>
                    <TableCell sx={{ padding: "6px 8px" }}>
                      <strong>Tên</strong>
                    </TableCell>
                    <TableCell sx={{ padding: "6px 8px" }}>
                      <strong>Số điện thoại</strong>
                    </TableCell>
                    <TableCell sx={{ padding: "6px 8px" }}>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell sx={{ padding: "6px 8px" }}>
                      <strong>Ngày sinh</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.id}>
                        <TableCell sx={{ padding: "6px 8px" }}>
                            <Checkbox
                            checked={selectedCustomers.includes(customer.id)}  // Kiểm tra xem customer.id có trong selectedCustomers không
                            onChange={() => handleSelectCustomer(customer.id)}  // Gọi hàm chọn hoặc bỏ chọn
                            color="primary"
                            />
                        </TableCell>
                        <TableCell sx={{ padding: "6px 8px" }}>{customer.tenKhachHang}</TableCell>
                        <TableCell sx={{ padding: "6px 8px" }}>{customer.sdt}</TableCell>
                        <TableCell sx={{ padding: "6px 8px" }}>{customer.email}</TableCell>
                        <TableCell sx={{ padding: "6px 8px" }}>{customer.ngaySinh}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Phân trang */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2">Xem</Typography>
                <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} size="small" sx={{ minWidth: "60px" }}>
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
                page={page + 1}
                onChange={(event, newPage) => handleChangePage(newPage - 1)}
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
            onClick={handleUpdate}  // Gọi hàm handleUpdate khi nhấn nút
          >
            Cập nhật
          </Button>
      
        </Box>
      </Box>
    </Box>
  );
};

export default DetailPhieuGiamGia;
