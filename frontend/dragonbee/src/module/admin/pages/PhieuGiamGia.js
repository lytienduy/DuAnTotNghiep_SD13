import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { Dialog, DialogTitle, DialogActions,   } from "@mui/material";
import { useLocation } from "react-router-dom";
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
  Pagination,
  Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DiscountCoupons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  // State lưu dữ liệu
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const [ma, setMa] = useState("");
  const [tuNgay, setTuNgay] = useState("");
  const [denNgay, setDenNgay] = useState("");
  const [kieuGiamGia, setKieuGiamGia] = useState("");
  const [trangThai, setTrangThai] = useState("");

  const [openDialog, setOpenDialog] = useState(false);  // Mở/Đóng dialog
  const [selectedDiscountCode, setSelectedDiscountCode] = useState(null);

  useEffect(() => {

    const fetchCoupons = async () => {
      try {
        console.log("Tham số tìm kiếm:", ma, tuNgay, denNgay, kieuGiamGia, trangThai);  // Kiểm tra tham số

        const response = await axios.get("http://localhost:8080/dragonbee/search-phieu-giam-gia", {
          params: {
            page,
            size: rowsPerPage,
            sort: "ngayTao,desc",
            maOrTen: ma,
            tuNgay,
            denNgay,
            kieuGiamGia,
            trangThai
          },
        });

        console.log("Dữ liệu API trả về:", response.data);  // Kiểm tra dữ liệu trả về

        setData(response.data.content);
        setTotalItems(response.data.totalElements);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    // // Kiểm tra nếu có thông báo từ `navigate`
    // if (location.state?.successMessage) {
    //   setMessage(location.state.successMessage);
    //   setOpenSnackbar(true);
    // }

    fetchCoupons();
  }, [page, rowsPerPage, ma, tuNgay, denNgay, kieuGiamGia, trangThai, location.state]);

  // Hàm xử lý thay đổi trạng thái phiếu giảm giá
  const handleStatusChange = (ma) => {
    setSelectedDiscountCode(ma);  // Lưu mã phiếu giảm giá
    setOpenDialog(true);  // Mở dialog xác nhận
  };

  // Hàm xác nhận thay đổi trạng thái
  const handleConfirmChange = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/dragonbee/change-status/${selectedDiscountCode}`);

      // Cập nhật lại state sau khi thay đổi trạng thái
      setData((prevData) =>
        prevData.map((item) =>
          item.ma === selectedDiscountCode ? { ...item, trangThai: response.data, trangThaiTuyChinh: true } : item
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái: " + (error.response?.data || error.message));
    }

    setOpenDialog(false);  // Đóng dialog sau khi xác nhận
  };

  // Hàm hủy thay đổi
  const handleCancelChange = () => {
    setOpenDialog(false);  // Đóng dialog khi hủy
  };

  // Kiểm tra phiếu giảm giá có hết hạn hay chưa
  const isDiscountExpired = (endDate) => {
    const now = new Date();
    return new Date(endDate) < now;
  };

  // Hàm xử lý phân trang
  const handleChangePage = (newPage) => {
    setPage(newPage);  // Nhận giá trị page đúng cho API (0-indexed)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);  // Quay lại trang đầu tiên khi thay đổi số lượng dòng
  };

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setMessage(location.state.successMessage);
      setOpenSnackbar(true);

      // Reset state to prevent showing message again after reload
      setTimeout(() => {
        setOpenSnackbar(false);
        setMessage("");  // Clear the message after the Snackbar closes
      }, 3000); // Snackbar duration
    }
  }, [location]);
  // hàm xuất excel
  const handleExportExcel = () => {
    console.log("Dữ liệu cần xuất:", data);
  
    // Kiểm tra dữ liệu có tồn tại không
    if (!Array.isArray(data) || data.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }
  
    if (!window.confirm("Bạn có muốn xuất file Excel không?")) return;
  
    const excelData = data.map((row, index) => ({
      "STT": index + 1,
      "Mã": row.ma,
      "Tên": row.tenPhieuGiamGia,
      "Kiểu": row.kieuGiamGia,
      "Loại": row.formattedGiaTriGiam,
      "Số lượng": row.soLuong,
      "Ngày bắt đầu": new Date(row.ngayBatDau).toLocaleString("vi-VN"),
      "Ngày kết thúc": new Date(row.ngayKetThuc).toLocaleString("vi-VN"),
      "Trạng thái": row.trangThai,
    }));
  
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách");
  
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "DanhSachPhieuGiamGia.xlsx");
  };
  
  
  return (
    <Box >
      {/* Dialog xác nhận */}
      <Dialog open={openDialog} onClose={handleCancelChange}>
        <DialogTitle sx={{ textAlign: "center" }}>
          <InfoOutlinedIcon sx={{ fontSize: 70, color: "#1976D2", marginBottom: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Bạn có chắc chắn muốn chuyển trạng thái của phiếu giảm giá: <strong>{selectedDiscountCode}</strong> này không?
          </Typography>
        </DialogTitle>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button onClick={handleConfirmChange} color="primary" variant="contained">
            Vâng!
          </Button>
          <Button onClick={handleCancelChange} color="error" variant="contained">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
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
  onClick={handleExportExcel}
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
            onClick={() => navigate("/admin/phieu-giam-gia/them-moi")}
          >
            + Tạo mới
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          margin: "15px 0",
          marginBottom: 3 // Khoảng cách 15px phía trên và dưới
        }}
      >
        <Typography sx={{ marginBottom: 2, fontWeight: "bold", fontSize: "16px" }}>
          Bộ lọc
        </Typography>
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
            value={ma}
            onChange={(e) => setMa(e.target.value)}  // Cập nhật state khi người dùng nhập vào
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "gray", marginRight: 1 }} />,
            }}
          />

          <TextField
            label="Từ ngày"
            type="date"
            size="small"
            value={tuNgay}
            onChange={(e) => setTuNgay(e.target.value)} // Cập nhật tuNgay
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Đến ngày"
            type="date"
            size="small"
            value={denNgay}
            onChange={(e) => setDenNgay(e.target.value)} // Cập nhật denNgay
            InputLabelProps={{ shrink: true }}
          />


          <Select
            size="small"
            value={kieuGiamGia}
            onChange={(e) => setKieuGiamGia(e.target.value)} // Cập nhật kieuGiamGia
            displayEmpty
          >
            <MenuItem value="">Kiểu</MenuItem>
            <MenuItem value="Cá nhân">Cá nhân</MenuItem>
            <MenuItem value="Công khai">Công khai</MenuItem>
          </Select>

          <Select
            size="small"
            value={trangThai}
            onChange={(e) => setTrangThai(e.target.value)} // Cập nhật trangThai
            displayEmpty
          >
            <MenuItem value="">Trạng thái</MenuItem>
            <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
            <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
            <MenuItem value="Chưa diễn ra">Chưa diễn ra</MenuItem>
          </Select>

        </Box>
      </Paper>


      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", textAlign: "center" }}>STT</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textAlign: "center" }}>Mã</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textAlign: "center" }}>Tên</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textAlign: "center" }}>Kiểu</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textAlign: "center" }}>Loại</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textAlign: "center", whiteSpace: "nowrap" }}>Số lượng</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textAlign: "center" }}>Ngày bắt đầu</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textAlign: "center" }}>Ngày kết thúc</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textAlign: "center" }}>Trạng thái</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", textAlign: "center" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, index) => {
                const isExpired = isDiscountExpired(row.ngayKetThuc);
                const isEditable = !isExpired;  // Nếu đã hết hạn thì không thể thay đổi trạng thái

                return (
                  <TableRow key={row.ma}>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="center">{row.ma}</TableCell>
                    <TableCell align="center">{row.tenPhieuGiamGia}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.kieuGiamGia}
                        sx={{
                          bgcolor: row.kieuGiamGia === "Cá nhân" ? "#e3f2fd" : "#fce4ec",
                          color: row.kieuGiamGia === "Cá nhân" ? "#1976d2" : "#d81b60",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {row.formattedGiaTriGiam.replace(/(\d+)(\.\d+)?/, (match, intPart) => {
                        return parseInt(intPart, 10).toLocaleString('en-US');
                      })}
                    </TableCell>
                    <TableCell align="center">{row.soLuong}</TableCell>
                    <TableCell align="center">
                      {new Date(row.ngayBatDau).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell align="center">
                      {new Date(row.ngayKetThuc).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell align="center">
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
                    <TableCell align="center" sx={{ width: 150, whiteSpace: 'nowrap' }}>
                      <Tooltip title="Chỉnh sửa" arrow>
                        <IconButton onClick={() => navigate(`/admin/phieu-giam-gia/chinh-sua/${row.ma}`)}>
                          <ModeEditOutlineIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chuyển trạng thái" arrow>
                        <IconButton
                          onClick={() => handleStatusChange(row.ma)}
                          disabled={isExpired} // Disable icon if the discount is expired
                        >
                          <ChangeCircleIcon fontSize="large" color={isEditable ? "primary" : "disabled"} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">Xem</Typography>
          <Select value={rowsPerPage} onChange={(e) => handleChangeRowsPerPage(e)} size="small" sx={{ minWidth: "60px" }}>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
          <Typography variant="body2">phiếu giảm giá</Typography>
        </Box>

        <Pagination
          count={Math.ceil(totalItems / rowsPerPage)} // Sử dụng totalItems để tính số trang
          page={page + 1}  // Hiển thị trang với giá trị +1 cho người dùng
          onChange={(event, newPage) => handleChangePage(newPage - 1)}  // Chuyển đổi về 0-indexed cho API
          color="primary"
        />
      </Box>

    </Box>
  );
};

export default DiscountCoupons;
