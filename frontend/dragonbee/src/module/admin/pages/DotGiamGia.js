// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Paper,
//     Typography,
//     TextField,
//     InputAdornment,
//     IconButton,
//     Button,
//     MenuItem,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Select,
//     FormControl,
//     Pagination,
//     InputLabel,
//     Chip
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
// import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
// import { useNavigate } from "react-router-dom";

// const DotGiamGia = () => {
//     const navigate = useNavigate();
//     const [data, setData] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [totalItems, setTotalItems] = useState(0);

//     // Hàm xử lý phân trang
//     const handleChangePage = (newPage) => {
//         setPage(newPage);  // Nhận giá trị page đúng cho API (0-indexed)
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);  // Quay lại trang đầu tiên khi thay đổi số lượng dòng
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8080/api/dot-giam-gia?page=${page}&size=${rowsPerPage}`);
//                 const result = await response.json();
//                 setData(result.content);
//                 setTotalItems(result.totalElements);
//             } catch (error) {
//                 console.error("Lỗi khi tải dữ liệu đợt giảm giá:", error);
//             }
//         };

//         fetchData();
//     }, [page, rowsPerPage]);

//     return (
//         <Box >
//             <Box
//                 sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: 3,
//                 }}
//             >
//                 <Typography variant="h5" fontWeight="bold">
//                     Đợt Giảm Giá
//                 </Typography>
//                 <Box>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         sx={{ marginRight: 2 }}
//                         onClick={() => alert("Xuất Excel")}
//                     >
//                         Xuất Excel
//                     </Button>
//                     <Button
//                         variant="outlined"
//                         sx={{
//                             color: "#1976D2",
//                             borderColor: "#1976D2",
//                             backgroundColor: "#fff",
//                             "&:hover": {
//                                 backgroundColor: "#e3f2fd",
//                                 borderColor: "#1565c0",
//                                 color: "#1565c0",
//                             },
//                         }}
//                         onClick={() => navigate("/admin/dot-giam-gia/them-moi")}
//                     >
//                         + Tạo mới
//                     </Button>
//                 </Box>
//             </Box>

//             {/* Search and Filters */}
//             <Paper
//                 elevation={3}
//                 sx={{
//                     padding: 3,
//                     borderRadius: 2,
//                     margin: "15px 0",
//                     marginBottom: 3 // Khoảng cách 15px phía trên và dưới
//                 }}
//             >
//                 <Typography sx={{ marginBottom: 2, fontWeight: "bold", fontSize: "16px" }}>
//                     Bộ lọc
//                 </Typography>
//                 <Box
//                     sx={{
//                         display: "flex",
//                         gap: 2,
//                         marginBottom: 3,
//                         alignItems: "center",
//                         flexWrap: "wrap",
//                     }}
//                 >
//                     <TextField
//                         placeholder="Tìm đợt giảm giá theo mã hoặc tên"
//                         variant="outlined"
//                         size="small"
//                         sx={{ flex: 1 }}
//                         InputProps={{
//                             startAdornment: <SearchIcon sx={{ color: "gray", marginRight: 1 }} />,
//                         }}
//                     />

//                     <TextField
//                         label="Từ ngày"
//                         type="date"
//                         size="small"
//                         InputLabelProps={{ shrink: true }}
//                     />

//                     <TextField
//                         label="Đến ngày"
//                         type="date"
//                         size="small"
//                         InputLabelProps={{ shrink: true }}
//                     />
//                     <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
//                         <InputLabel id="gia-tri-label" shrink>Giá trị</InputLabel>
//                         <Select
//                             labelId="gia-tri-label"
//                             id="gia-tri-select"
//                             displayEmpty
//                             label="Giá trị"
//                             value={""}
//                         >
//                             <MenuItem value="">Tất cả</MenuItem>
//                             <MenuItem value="Tăng dần">Tăng dần</MenuItem>
//                             <MenuItem value="Giảm dần">Giảm dần</MenuItem>
//                         </Select>
//                     </FormControl>

//                     <FormControl size="small" sx={{ minWidth: 150 }}>
//                         <InputLabel id="trang-thai-label" shrink>Trạng thái</InputLabel>
//                         <Select
//                             labelId="trang-thai-label"
//                             id="trang-thai-select"
//                             displayEmpty
//                             label="Trạng thái"
//                             value={""}
//                         >
//                             <MenuItem value="">Tất cả</MenuItem>
//                             <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
//                             <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
//                             <MenuItem value="Chưa diễn ra">Chưa diễn ra</MenuItem>
//                         </Select>
//                     </FormControl>

//                 </Box>
//             </Paper>

//             {/* Bảng đợt giảm giá */}
//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell sx={{ fontWeight: 'bold', paddingLeft: "30px" }}>STT</TableCell>

//                             <TableCell sx={{ fontWeight: 'bold' }}>Tên Đợt giảm giá</TableCell>
//                             <TableCell align="center" sx={{ fontWeight: 'bold' }}>Giá trị</TableCell>
//                             <TableCell align="center" sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
//                             <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thời gian bắt đầu</TableCell>
//                             <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thời gian kết thúc</TableCell>
//                             <TableCell align="center" sx={{ fontWeight: 'bold' }}>Hoạt động</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {data.map((row, index) => (
//                             <TableRow key={row.id}>
//                                 <TableCell sx={{ fontWeight: 'bold', paddingLeft: "30px" }}>
//                                     {page * rowsPerPage + index + 1}
//                                 </TableCell>

//                                 <TableCell>{row.tenDotGiamGia}</TableCell>
//                                 <TableCell align="center">
//                                     {row.loaiDotGiamGia === "Phần trăm"
//                                         ? `${row.giaTriGiam}%`
//                                         : row.loaiDotGiamGia === "Cố định"
//                                             ? `${row.giaTriGiam.toLocaleString("vi-VN")} VNĐ`
//                                             : "-"}
//                                 </TableCell>
//                                 <TableCell align="center">
//                                     <Chip
//                                         label={row.trangThai}
//                                         sx={{
//                                             bgcolor:
//                                                 row.trangThai === "Đang diễn ra"
//                                                     ? "#e8f5e9"
//                                                     : row.trangThai === "Đã kết thúc"
//                                                         ? "#ffebee"
//                                                         : "#fff8e1",
//                                             color:
//                                                 row.trangThai === "Đang diễn ra"
//                                                     ? "#2e7d32"
//                                                     : row.trangThai === "Đã kết thúc"
//                                                         ? "#c62828"
//                                                         : "#f57c00",
//                                         }}
//                                     />
//                                 </TableCell>
//                                 <TableCell align="center">
//                                     {new Date(row.ngayBatDau).toLocaleTimeString("vi-VN", {
//                                         hour: "2-digit",
//                                         minute: "2-digit",
//                                     })}
//                                     <br />
//                                     {new Date(row.ngayBatDau).toLocaleDateString("vi-VN", {
//                                         day: "2-digit",
//                                         month: "2-digit",
//                                         year: "numeric",
//                                     })}
//                                 </TableCell>

//                                 <TableCell align="center">
//                                     {new Date(row.ngayKetThuc).toLocaleTimeString("vi-VN", {
//                                         hour: "2-digit",
//                                         minute: "2-digit",
//                                     })}
//                                     <br />
//                                     {new Date(row.ngayKetThuc).toLocaleDateString("vi-VN", {
//                                         day: "2-digit",
//                                         month: "2-digit",
//                                         year: "numeric",
//                                     })}
//                                 </TableCell>

//                                 <TableCell align="center">
//                                     <IconButton onClick={() => navigate(`/admin/dot-giam-gia/chinh-sua/${row.id}`)}>
//                                         <ModeEditOutlineIcon />
//                                     </IconButton>
//                                     <IconButton >
//                                         <ChangeCircleIcon fontSize="large" />
//                                     </IconButton>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Phân trang */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <Typography variant="body2">Xem</Typography>
//                     <Select value={rowsPerPage} onChange={(e) => handleChangeRowsPerPage(e)} size="small" sx={{ minWidth: "60px" }}>
//                         <MenuItem value={1}>1</MenuItem>
//                         <MenuItem value={5}>5</MenuItem>
//                         <MenuItem value={10}>10</MenuItem>
//                         <MenuItem value={15}>15</MenuItem>
//                         <MenuItem value={20}>20</MenuItem>
//                         <MenuItem value={25}>25</MenuItem>
//                     </Select>
//                     <Typography variant="body2">phiếu giảm giá</Typography>
//                 </Box>

//                 {totalItems > 0 && (
//                     <Pagination
//                         count={Math.max(1, Math.ceil(totalItems / rowsPerPage))}
//                         page={page + 1}
//                         onChange={(event, newPage) => handleChangePage(newPage - 1)}
//                         color="primary"
//                     />
//                 )}
//             </Box>
//         </Box>
//     );
// };

// export default DotGiamGia;
