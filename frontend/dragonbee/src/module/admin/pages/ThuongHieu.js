import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress 
} from "@mui/material";
import { Add, Visibility, Edit, Delete } from "@mui/icons-material";

const ThuongHieu = () => {
  const [thuongHieuList, setThuongHieuList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách Thương Hiệu từ Spring Boot
  useEffect(() => {
    axios.get("http://localhost:8080/api/thuonghieu")
      .then(response => {
        setThuongHieuList(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Quản Lý Thương Hiệu
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
                <TableCell><strong>Tên Thương Hiệu</strong></TableCell>
                <TableCell><strong>Mô Tả</strong></TableCell>
                <TableCell><strong>Trạng Thái</strong></TableCell>
                <TableCell align="center"><strong>Thao Tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {thuongHieuList.map((thuongHieu, index) => (
                <TableRow key={thuongHieu.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{thuongHieu.tenThuongHieu}</TableCell>
                  <TableCell>{thuongHieu.moTa || "Không có mô tả"}</TableCell>
                  <TableCell sx={{ color: thuongHieu.trangThai ? "green" : "red" }}>
                    {thuongHieu.trangThai ? "Hoạt động" : "Ngừng hoạt động"}
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
    </Container>
  );
};

export default ThuongHieu;
