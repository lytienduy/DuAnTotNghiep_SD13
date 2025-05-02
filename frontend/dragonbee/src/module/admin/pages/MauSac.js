import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, Typography, Button, Table, TableBody, TableCell, Box,
  TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress,MenuItem,FormControl,Grid,Select,TextField,
} from "@mui/material";
import { Add, Visibility, ChevronLeft,
  ChevronRight, Edit, Delete,Sync} from "@mui/icons-material";

const MauSac = () => {
  const [mauSacList, setMauSacList] = useState([]); // Đặt tên đúng cho state
  const [loading, setLoading] = useState(true);
  const [trangThai, setTrangThai] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  // Gọi API từ Spring Boot
  useEffect(() => {
    setLoading(true); // Bắt đầu loading
    axios
      .get(`http://localhost:8080/api/mausac/phan-trang?page=${page}&size=${rowsPerPage}`)
      .then((response) => {
        console.log("Dữ liệu phân trang:", response.data); // ✅ Xem dữ liệu
        setMauSacList(response.data.content); // Lấy danh sách màu sắc
        setTotalPages(response.data.totalPages); // Tổng số trang
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API phân trang:", error);
        setLoading(false);
      });
  }, [page, rowsPerPage]); // 👈 Gọi lại khi page hoặc size thay đổi
  

const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page + 1 && i <= page + 2)) {
        pages.push(
          <Button
            key={i}
            variant={i === page + 1 ? "contained" : "text"} // Đánh dấu trang hiện tại
            onClick={() => setPage(i - 1)} // Cập nhật trang
            sx={{
              minWidth: "36px",
              height: "38px",
              borderRadius: "55%",
              mx: 0.5,
              "&:hover": { backgroundColor: "#ddd" },
            }}
          >
            {i}
          </Button>
        );
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };
  return (
    <Box>
      <Grid container alignItems="center" justifyContent="space-between">
             {/* Tiêu đề */}
             <Grid item>
               <Typography variant="h4" gutterBottom>
                 Quản Lý Màu Sắc
               </Typography>
             </Grid>
     
             {/* Nút Tạo Mới */}
             <Grid item>
               <Button
                 variant="outlined"
                 sx={{
                   color: "lightblue",
                   backgroundColor: "white",
                   borderColor: "lightblue",
                   "&:hover": {
                     backgroundColor: "lightblue",
                     color: "white",
                     borderColor: "lightblue",
                   },
                 }}
                 startIcon={<Add sx={{ color: "lightblue" }} />}
                 onClick={""}
               >
                 Tạo Mới
               </Button>
             </Grid>
           </Grid>
      <Paper sx={{ padding: 3, mb: 3 }}>
        {/* Sử dụng Grid container để thẳng hàng ô tìm kiếm, bộ lọc và nút tạo mới */}
        <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
            <Typography variant="h6">Bộ Lọc</Typography>
          </Grid>
          {/* Tìm kiếm */}
          <Grid item xs={12} md={4}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Tìm kiếm
            </Typography>
            <TextField
              label="Tìm kiếm theo tên màu sắc"
              value={""}
              onChange={"handleSearchTenChatLieuChange"}
              fullWidth
              size="small" // Giảm kích thước của TextField
            />
          </Grid>

          {/* Bộ lọc trạng thái */}
          <Grid item xs={12} md={3}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Trạng thái
            </Typography>
            <FormControl fullWidth size="small" variant="outlined">
              <Select
                value={trangThai}
                onChange={(e) => setTrangThai(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Nút tạo mới */}
        </Grid>
      </Paper>
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
                <TableCell align="center"><strong>Hành Động</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mauSacList.map((mauSac, index) => (
                <TableRow key={mauSac.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{mauSac.tenMauSac || "Chưa có tên"}</TableCell> {/* Sửa đúng trường dữ liệu */}
                  <TableCell>{mauSac.moTa || "Không có mô tả"}</TableCell>
                  <TableCell
                                     sx={{ color: mauSac.trangThai ? "green" : "red" }}
                                   >
                                     {mauSac.trangThai ? "Hoạt động" : "Ngừng hoạt động"}
                                   </TableCell>
                  <TableCell align="center">
                    {/* Nút xem chi tiết */}
                    <IconButton color="primary" onClick={() => console.log(`Xem chi tiết: ${mauSac.id}`)}>
                      <Visibility />
                    </IconButton>
                    <IconButton color="secondary">
                                          <Sync />
                                        </IconButton>
                   

                    {/* Nút xóa */}
                   
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
       <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            mt={2}
          >
            <Box display="flex" alignItems="center">
              <Typography mr={2}>Xem</Typography>
              <Select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(e.target.value);
                  setPage(0); // reset về trang đầu
                }}
                sx={{
                  height: "32px", // Giảm chiều cao
                  minWidth: "60px",
                  borderRadius: "8px",
                  "&.Mui-focused": {
                    borderColor: "#1976D2", // Màu xanh dương khi chọn
                    borderWidth: "2px",
                  },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>

              <Typography ml={2}>Màu Sắc</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                <ChevronLeft />
              </IconButton>
              {renderPageNumbers()}
              <IconButton
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
    </Box>
  );
};

export default MauSac;
