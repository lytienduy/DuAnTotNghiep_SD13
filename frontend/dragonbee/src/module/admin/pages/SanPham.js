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
  Box,
  FormControl,
  Grid,
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

  const navigate = useNavigate();

  // Hàm gọi API với debounce
  const fetchData = useCallback(() => {
    setLoading(true);
  
    axios
      .get(`http://localhost:8080/api/sanpham/search`, {
        params: {
          page: page - 1, // 🔥 Truyền giá trị page hiện tại (Spring Boot sử dụng 0-based index)
          size: 5,
          tenSanPham: search.trim() || null,
          trangThai: trangThai || null,
        },
      })
      .then((response) => {
        setSanPhams(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setLoading(false);
      });
  }, [page, search, trangThai]); // 🔥 Cập nhật khi `page`, `search`, `trangThai` thay đổi
  
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
// Thêm thư viện XLSX nếu chưa có


const exportToExcel = () => {
  if (sanPhams.length === 0) {
    alert("Không có dữ liệu để xuất Excel.");
    return;
  }

  const data = sanPhams.map((sp, index) => ([
    index + 1,
    sp.ma || "N/A",                     // Mã sản phẩm
    sp.tenSanPham || "Không rõ",         // Tên sản phẩm
    sp.tongSoLuong ?? "0",              // Số lượng
    sp.ngayTao
      ? new Date(sp.ngayTao).toLocaleDateString("vi-VN")
      : "Chưa cập nhật",               // Ngày tạo
    sp.trangThai || "Không xác định"     // Trạng thái
  ]));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ["STT", "Mã Sản Phẩm", "Tên Sản Phẩm", "Số Lượng", "Ngày Tạo", "Trạng Thái"],
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
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Định dạng ô dữ liệu
  const cellStyle = {
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
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
    { wch: 5 },   // STT
    { wch: 15 },  // Mã sản phẩm
    { wch: 25 },  // Tên sản phẩm
    { wch: 12 },  // Số lượng
    { wch: 15 },  // Ngày tạo
    { wch: 15 }   // Trạng thái
  ];

  // Xuất file Excel
  XLSX.utils.book_append_sheet(wb, ws, "Danh Sách Sản Phẩm");
  XLSX.writeFile(wb, "DanhSachSanPham.xlsx");
};

  return (
    <Container maxWidth="lg">
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Danh Sách Sản Phẩm</Typography>

        {/* Nút tạo mới di chuyển sang góc phải */}
        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <Button variant="contained" color="primary" onClick={exportToExcel}>Xuất   Excel</Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
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
                <MenuItem value="Còn hàng">Còn hàng</MenuItem>
                <MenuItem value="Hết hàng">Hết hàng</MenuItem>
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

                      <TableCell>{sp.tenSanPham}</TableCell>
                      <TableCell>{sp.tongSoLuong ?? "0"}</TableCell>
                      <TableCell>
                        {new Date(sp.ngayTao).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: sp.trangThai === "Còn hàng" ? "green" : "red",
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

          {/* Phân trang */}
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      )}
    </Container>
  );
};

export default SanPham;