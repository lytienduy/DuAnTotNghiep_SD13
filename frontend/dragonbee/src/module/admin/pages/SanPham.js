import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
  TextField,
  MenuItem,
  Select,
  Switch,
  Box,
  FormControl,
  Grid,
  Snackbar, // Import Snackbar
  Alert, // Import Alert component for better notification display
} from "@mui/material";

import { Add, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SanPham = () => {
  const [sanPhams, setSanPhams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // Mở đóng Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Nội dung thông báo
  const [size, setSize] = useState(5);

  const navigate = useNavigate();

  // Hàm gọi API với debounce
  const fetchData = useCallback(() => {
    setLoading(true);
  
    axios
      .get(`http://localhost:8080/api/sanpham/search`, {
        params: {
          page: page - 1,
          size: size,
          tenSanPham: search.trim() || null,
          trangThai: trangThai || null,
        },
      })
      .then((response) => {
        console.log(response.data); // Kiểm tra dữ liệu trả về
        setSanPhams(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setLoading(false);
      });
  }, [page, search, trangThai, size]);
  

  // Gọi API khi search, trangThai hoặc page thay đổi
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 500); // Debounce để tránh gọi API quá nhiều lần

    return () => clearTimeout(delayDebounce);
  }, [fetchData]); // 🔥 Đảm bảo gọi lại khi `fetchData` thay đổi

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // 🔥 Reset về trang đầu khi tìm kiếm
  };

  const handleTrangThaiChange = (e) => {
    setTrangThai(e.target.value);
    setPage(1); // 🔥 Reset về trang đầu khi thay đổi bộ lọc
  };

  // hàm export excel
  const exportToExcel = () => {
    if (sanPhams.length === 0) {
      alert("Không có dữ liệu để xuất Excel.");
      return;
    }

    const data = sanPhams.map((sp, index) => [
      index + 1,
      sp.ma || "N/A", // Mã sản phẩm
      sp.tenSanPham || "Không rõ", // Tên sản phẩm
      sp.tongSoLuong ?? "0", // Số lượng
      sp.ngayTao
        ? new Date(sp.ngayTao).toLocaleDateString("vi-VN")
        : "Chưa cập nhật", // Ngày tạo
      sp.trangThai || "Không xác định", // Trạng thái
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "STT",
        "Mã Sản Phẩm",
        "Tên Sản Phẩm",
        "Số Lượng",
        "Ngày Tạo",
        "Trạng Thái",
      ],
      ...data,
    ]);

    // Định dạng header
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4CAF50" } }, // Xanh lá nhạt
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    // Định dạng ô dữ liệu
    const cellStyle = {
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    // Áp dụng định dạng cho tiêu đề
    const headerRow = ["A1", "B1", "C1", "D1", "E1", "F1"];
    headerRow.forEach((cell) => {
      if (ws[cell]) ws[cell].s = headerStyle;
    });

    // Áp dụng định dạng cho dữ liệu
    const numRows = data.length + 1;
    for (let row = 2; row <= numRows + 1; row++) {
      for (let col = 0; col < 6; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row - 1, c: col });
        if (ws[cellRef]) ws[cellRef].s = cellStyle;
      }
    }

    // Đặt độ rộng cột
    ws["!cols"] = [
      { wch: 5 }, // STT
      { wch: 15 }, // Mã sản phẩm
      { wch: 25 }, // Tên sản phẩm
      { wch: 12 }, // Số lượng
      { wch: 15 }, // Ngày tạo
      { wch: 15 }, // Trạng thái
    ];

    // Xuất file Excel
    XLSX.utils.book_append_sheet(wb, ws, "Danh Sách Sản Phẩm");
    XLSX.writeFile(wb, "DanhSachSanPham.xlsx");

    // Hiển thị thông báo thành công
    setSnackbarMessage("Xuất Excel thành công!");
    setOpenSnackbar(true);
  };

  // chuyển đổi trạng thái switch
  const toggleTrangThai = async (id) => {
    try {
      // Gọi API để cập nhật trạng thái
      const response = await axios.put(
        `http://localhost:8080/api/sanpham/${id}/toggle-trang-thai`
      );
  
      console.log("Phản hồi API:", response.data);
  
      // Cập nhật trực tiếp trạng thái trong sanPhams state
      setSanPhams((prevSanPhams) =>
        prevSanPhams.map((sp) =>
          sp.id === id ? { ...sp, trangThai: sp.trangThai === "Đang bán" ? "Ngừng bán" : "Đang bán" } : sp
        )
      );
  
      setSnackbarMessage("Cập nhật trạng thái thành công!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Lỗi khi chuyển trạng thái:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái sản phẩm!");
    }
  };
  
  
  
  

  return (
    <Container maxWidth="lg">
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Quản Lý Sản Phẩm</Typography>

        {/* Nút tạo mới di chuyển sang góc phải */}
        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
          <Button variant="contained" color="primary" onClick={exportToExcel}>
            Xuất Excel
          </Button>
          <Button
            variant="outlined" // Kiểu nút với viền
            sx={{
              color: "primary", // Màu chữ xanh nhạt
              backgroundColor: "white", // Màu nền trắng
              borderColor: "lightblue", // Màu viền xanh nhạt
              "&:hover": {
                backgroundColor: "lightblue", // Màu nền khi hover
                color: "white", // Màu chữ khi hover
                borderColor: "primary", // Màu viền khi hover
              },
            }}
            startIcon={<Add sx={{ color: "primary" }} />} // Màu của biểu tượng dấu "+"
            onClick={() => navigate("/sanpham/addProduct")}
          >
            Tạo Mới
          </Button>
        </Box>
      </Grid>

      {/* Bộ lọc và ô tìm kiếm */}
      <Paper sx={{ padding: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Ô tìm kiếm */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Tìm kiếm theo tên"
              variant="outlined"
              fullWidth
              size="small"
              value={search}
              onChange={handleSearchChange} // Gọi hàm xử lý tìm kiếm
            />
          </Grid>

          {/* Bộ lọc trạng thái */}
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <Typography variant="caption">Trạng Thái</Typography>
              <Select
                value={trangThai}
                onChange={handleTrangThaiChange} // Gọi hàm xử lý lọc trạng thái
                displayEmpty
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Đang bán">Đang bán</MenuItem>
                <MenuItem value="Ngừng bán">Ngừng bán</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Hiển thị dữ liệu */}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>STT</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Mã Sản Phẩm</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tên Sản Phẩm</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Số Lượng</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Ngày Tạo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Trạng Thái</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Hành Động</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sanPhams.length > 0 ? (
                  sanPhams.map((sp, index) => (
                    <TableRow key={sp.id}>
                      <TableCell>{(page - 1) * 5 + index + 1}</TableCell>
                      <TableCell>{sp.ma}</TableCell>
                      <TableCell>{sp.tenSanPham}</TableCell>
                      <TableCell>{sp.tongSoLuong ?? "0"}</TableCell>
                      <TableCell>
                        {new Date(sp.ngayTao).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: sp.trangThai === "Đang bán" ? "green" : "red",
                        }}
                      >
                        {sp.trangThai ?? "Không xác định"}
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          color="primary"
                          onClick={() => navigate(`/sanpham/${sp.id}`)}
                        >
                          <Visibility />
                        </Button>
                        <Switch
                          checked={sp.trangThai === "Đang bán"} // Kiểm tra nếu trạng thái là "Đang bán"
                          onChange={() => toggleTrangThai(sp.id)}
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Không tìm thấy sản phẩm nào!
                    </TableCell>
                  </TableRow>
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

export default SanPham;
