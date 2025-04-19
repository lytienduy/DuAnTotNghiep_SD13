import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress 
} from "@mui/material";
import { Add, Visibility, Edit, Delete } from "@mui/icons-material";

const Size = () => {
  const [sizeList, setSizeList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách Size từ Spring Boot
  useEffect(() => {
    axios.get("http://localhost:8080/api/size")
      .then(response => {
        setSizeList(response.data);
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
        Quản Lý Size
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
                <TableCell><strong>Tên Size</strong></TableCell>
                <TableCell><strong>Mô Tả</strong></TableCell>
                <TableCell><strong>Trạng Thái</strong></TableCell>
                <TableCell align="center"><strong>Thao Tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sizeList.map((size, index) => (
                <TableRow key={size.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{size.tenSize}</TableCell>
                  <TableCell>{size.moTa || "Không có mô tả"}</TableCell>
                  <TableCell sx={{ color: size.trangThai ? "green" : "red" }}>
                    {size.trangThai ? "Hoạt động" : "Ngừng hoạt động"}
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

export default Size;
