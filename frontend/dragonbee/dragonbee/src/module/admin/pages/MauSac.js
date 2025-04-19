import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress 
} from "@mui/material";
import { Add, Visibility, Edit, Delete } from "@mui/icons-material";

const MauSac = () => {
  const [mauSacList, setMauSacList] = useState([]); // Đặt tên đúng cho state
  const [loading, setLoading] = useState(true);

  // Gọi API từ Spring Boot
  useEffect(() => {
    axios.get("http://localhost:8080/api/mausac")  // Sửa API endpoint cho đúng
      .then(response => {
        setMauSacList(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  // Hàm xử lý tạo mới (giả định có API hỗ trợ)
  const handleCreate = () => {
    console.log("Tạo mới màu sắc");
    // Bạn có thể gọi API để tạo mới tại đây
  };

  // Hàm xử lý sửa (giả định có API hỗ trợ)
  const handleEdit = (id) => {
    console.log("Chỉnh sửa màu sắc có id: ", id);
    // Bạn có thể mở modal hoặc trang sửa với id để thực hiện sửa
  };

  // Hàm xử lý xóa (giả định có API hỗ trợ)
  const handleDelete = (id) => {
    console.log("Xóa màu sắc có id: ", id);
    // Gọi API xóa tại đây
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Quản Lý Màu Sắc
      </Typography>

      {/* Nút tạo mới */}
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<Add />} 
        sx={{ mb: 2 }}
        onClick={handleCreate}  // Xử lý sự kiện tạo mới
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
                <TableCell><strong>Tên Màu</strong></TableCell>
                <TableCell><strong>Mô Tả</strong></TableCell>
                <TableCell><strong>Trạng Thái</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mauSacList.map((mauSac, index) => (
                <TableRow key={mauSac.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{mauSac.tenMauSac || "Chưa có tên"}</TableCell> {/* Sửa đúng trường dữ liệu */}
                  <TableCell>{mauSac.moTa || "Không có mô tả"}</TableCell>
                  <TableCell sx={{ color: mauSac.trangThai === "Hoạt động" ? "green" : "red" }}>
                    {mauSac.trangThai === "Hoạt động" ? "Hoạt động" : "Ngưng hoạt động"}
                  </TableCell>
                  <TableCell align="center">
                    {/* Nút xem chi tiết */}
                    <IconButton color="primary" onClick={() => console.log(`Xem chi tiết: ${mauSac.id}`)}>
                      <Visibility />
                    </IconButton>
                    
                   

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

export default MauSac;
