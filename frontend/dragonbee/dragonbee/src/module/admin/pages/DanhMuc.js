import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress 
} from "@mui/material";
import { Add, Visibility, Edit, Delete } from "@mui/icons-material";

const DanhMuc = () => {
  const [danhMucList, setDanhMucList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách Danh Mục từ Spring Boot
  useEffect(() => {
    axios.get("http://localhost:8080/api/danhmuc")
      .then(response => {
        setDanhMucList(response.data);
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
        Quản Lý Danh Mục
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
                <TableCell><strong>Tên Danh Mục</strong></TableCell>
                <TableCell><strong>Mô Tả</strong></TableCell>
                <TableCell><strong>Trạng Thái</strong></TableCell>
                <TableCell align="center"><strong>Thao Tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {danhMucList.map((danhMuc, index) => (
                <TableRow key={danhMuc.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{danhMuc.tenDanhMuc}</TableCell>
                  <TableCell>{danhMuc.moTa || "Không có mô tả"}</TableCell>
                  <TableCell sx={{ color: danhMuc.trangThai ? "green" : "red" }}>
                    {danhMuc.trangThai ? "Hoạt động" : "Ngừng hoạt động"}
                  </TableCell>
                  <TableCell align="center">
                    {/* Nút xem chi tiết */}
                    <IconButton color="primary">
                      <Visibility />
                    </IconButton>
                   
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

export default DanhMuc;
