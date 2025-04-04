import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, Typography, Button, Table, TableBody, TableCell,Box, 
  TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, 
} from "@mui/material";
import { Add, Visibility, Edit, Delete } from "@mui/icons-material";

const KieuDaiQuan = () => {
  const [kieuDaiQuanList, setKieuDaiQuanList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách Kiểu Đai Quần từ Spring Boot
  useEffect(() => {
    axios.get("http://localhost:8080/api/kieudaiquan")
      .then(response => {
        setKieuDaiQuanList(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Quản Lý Kiểu Đai Quần
      </Typography>

      {/* Nút tạo mới */}
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<Add />} 
        sx={{ mb: 2 }}
      >
        Tạo Mới
      </Button>

      {/* Hiển thị loading */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>STT</strong></TableCell>
                <TableCell><strong>Tên Kiểu Đai Quần</strong></TableCell>
                <TableCell><strong>Mô Tả</strong></TableCell>
                <TableCell><strong>Trạng Thái</strong></TableCell>
                <TableCell align="center"><strong>Thao Tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kieuDaiQuanList.map((kieuDaiQuan, index) => (
                <TableRow key={kieuDaiQuan.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{kieuDaiQuan.tenKieuDaiQuan}</TableCell>
                  <TableCell>{kieuDaiQuan.moTa || "Không có mô tả"}</TableCell>
                  <TableCell sx={{ color: kieuDaiQuan.trangThai ? "green" : "red" }}>
                    {kieuDaiQuan.trangThai ? "Hoạt động" : "Ngừng hoạt động"}
                  </TableCell>
                  <TableCell align="center">
                    {/* Nút xem chi tiết */}
                    <IconButton color="primary">
                      <Visibility />
                    </IconButton>
                    
                    {/* Nút sửa */}
                    

                    {/* Nút xóa */}
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default KieuDaiQuan;
