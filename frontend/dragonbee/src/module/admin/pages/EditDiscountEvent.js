// import React, { useState } from "react";
// import {
//     Box,
//     Button,
//     TextField,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Checkbox,
//     Pagination,
//     InputAdornment,
//     IconButton,
// } from "@mui/material";
// import PercentIcon from "@mui/icons-material/Percent";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import { useNavigate } from "react-router-dom";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';


// const EditDiscountEvent = () => {
//     const navigate = useNavigate(); // Tạo biến navigate để điều hướng
//     const [selectedProducts, setSelectedProducts] = useState([]);
//     const [selectAll, setSelectAll] = useState(false);
//     const [selected, setSelected] = useState("percent");
//     const [data, setData] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [totalItems, setTotalItems] = useState(0);

//     // Hàm xử lý quay lại trang trước
//     const handleBack = () => {
//         navigate("/admin/dot-giam-gia"); // Điều hướng về trang phiếu giảm giá
//     };

//     // Hàm xử lý phân trang
//     const handleChangePage = (newPage) => {
//         setPage(newPage);  // Nhận giá trị page đúng cho API (0-indexed)
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);  // Quay lại trang đầu tiên khi thay đổi số lượng dòng
//     };
//     const [products] = useState([
//         {
//             id: 1,
//             name: "Quần Tây Classic",
//             type: "Trẻ trung",
//             brand: "Zara",
//             material: "Vải",
//             color: "Xanh dương",
//             sole: "Dáng loe",
//         },
//         {
//             id: 2,
//             name: "Quần Tây Slim Fit",
//             type: "Cổ điển",
//             brand: "Converse",
//             material: "Vải Tuyết Mây",
//             color: "Trắng",
//             sole: "Dáng xuông",
//         },
//         {
//             id: 3,
//             name: "Quần Tây Luxury",
//             type: "Thời thượng",
//             brand: "AZAI",
//             material: "Vải Cotton",
//             color: "Đen",
//             sole: "Dáng ôm",
//         },
//         {
//             id: 4,
//             name: "Quần Tây Bassic",
//             type: "Cổ điển",
//             brand: "SAYHI",
//             material: "Vải",
//             color: "Đen",
//             sole: "Dáng xuông",
//         },
//         {
//             id: 5,
//             name: "Quần Tây AzaiSayHi",
//             type: "Trẻ trung",
//             brand: "PROBRO",
//             material: "Vải",
//             color: "Ghi",
//             sole: "Dáng ôm",
//         },
//     ]);

//     // Xử lý chọn tất cả
//     const handleSelectAll = (event) => {

//         const isChecked = event.target.checked;
//         setSelectAll(isChecked);
//         if (isChecked) {
//             // Chọn tất cả sản phẩm
//             setSelectedProducts(products.map((product) => product.id));
//         } else {
//             // Bỏ chọn tất cả
//             setSelectedProducts([]);
//         }
//     };

//     // Xử lý chọn từng sản phẩm
//     const handleSelectProduct = (productId) => {
//         if (selectedProducts.includes(productId)) {
//             // Nếu đã chọn, bỏ chọn sản phẩm đó
//             setSelectedProducts(selectedProducts.filter((id) => id !== productId));
//         } else {
//             // Nếu chưa chọn, thêm vào danh sách
//             setSelectedProducts([...selectedProducts, productId]);
//         }
//     };

//     // Render chi tiết sản phẩm đã chọn
//     const renderProductDetails = () => {
//         const selectedDetails = products.filter((product) =>
//             selectedProducts.includes(product.id)
//         );
//         if (selectedDetails.length === 0) return null;

//         return (
//             <Box mt={4}>
//                 <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//                     Chi tiết sản phẩm
//                 </Typography>
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell padding="checkbox">
//                                     <Checkbox
//                                         checked={selectAll}
//                                         onChange={handleSelectAll}
//                                     />
//                                 </TableCell>
//                                 <TableCell>STT</TableCell>
//                                 <TableCell>Tên sản phẩm</TableCell>
//                                 <TableCell>Thể loại</TableCell>
//                                 <TableCell>Thương hiệu</TableCell>
//                                 <TableCell>Chất liệu</TableCell>
//                                 <TableCell>Màu sắc</TableCell>
//                                 <TableCell>Kiểu dáng</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {products.map((product, index) => (
//                                 <TableRow key={product.id}>
//                                     <TableCell padding="checkbox">
//                                         <Checkbox
//                                             checked={selectedProducts.includes(product.id)}
//                                             onChange={() => handleSelectProduct(product.id)}
//                                         />
//                                     </TableCell>
//                                     <TableCell>{index + 1}</TableCell>
//                                     <TableCell>{product.name}</TableCell>
//                                     <TableCell>{product.type}</TableCell>
//                                     <TableCell>{product.brand}</TableCell>
//                                     <TableCell>{product.material}</TableCell>
//                                     <TableCell>{product.color}</TableCell>
//                                     <TableCell>{product.sole}</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 {/* Phần Xem sản phẩm và Phân trang */}
//                 <Box
//                     sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         mt: 2,
//                     }}
//                 >
//                     {/* Xem sản phẩm */}
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                         <Typography variant="body2" sx={{ mr: 1 }}>
//                             Xem
//                         </Typography>
//                         <Select
//                             size="small"
//                             defaultValue={5}
//                             sx={{ width: "70px", mr: 1 }}
//                             onChange={(e) => {
//                                 // Hàm xử lý khi thay đổi số sản phẩm hiển thị
//                                 console.log("Số sản phẩm hiển thị:", e.target.value);
//                             }}
//                         >
//                             <MenuItem value={5}>5</MenuItem>
//                             <MenuItem value={10}>10</MenuItem>
//                             <MenuItem value={15}>15</MenuItem>
//                         </Select>
//                         <Typography variant="body2">sản phẩm</Typography>
//                     </Box>

//                     {/* Phân trang */}
//                     <Box>
//                         <Pagination
//                             count={3} // Tổng số trang
//                             color="primary"
//                             onChange={(e, page) => {
//                                 // Hàm xử lý khi thay đổi trang
//                                 console.log("Trang hiện tại:", page);
//                             }}
//                         />
//                     </Box>
//                 </Box>
//             </Box>
//         );
//     };

//     return (
//         <Box sx={{ p: 3 ,marginTop:-3,marginLeft:-3}}>
//             {/* Header */}
//             <Box display="flex" alignItems="center" mb={3}>
//                 <IconButton onClick={handleBack} sx={{ marginRight: 2 }}>
//                     <ArrowBackIcon />
//                 </IconButton>
//                 <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//                     Đợt Giảm Giá{" "}
//                     <Box component="span" sx={{ color: "#b0b0b0", fontWeight: "bold" }}>
//                         / Chi tiết Đợt Giảm Giá
//                     </Box>
//                 </Typography>
//             </Box>

//             {/* Form + Bảng sản phẩm */}
//             <Box
//                 sx={{
//                     display: "flex",
//                     gap: 3,
//                     alignItems: "flex-start",
//                     flexWrap: "nowrap",
//                 }}
//             >
//                 {/* Form chiếm 40% */}
//                 <Box sx={{ flex: "0 0 40%", maxWidth: "40%" }}>
//                     <TextField
//                         label="Tên đợt giảm giá"
//                         required
//                         variant="outlined"
//                         size="small"
//                         fullWidth
//                         sx={{ mb: 2 }}
//                     />
//                     <TextField
//                         label="Giá trị"
//                         variant="outlined"
//                         size="small"
//                         fullWidth
//                         sx={{ mb: 2 }}
//                         InputProps={{
//                             endAdornment: (
//                                 <>
//                                     <InputAdornment position="end">
//                                         <IconButton
//                                             onClick={() => setSelected("percent")}
//                                             sx={{
//                                                 color: selected === "percent" ? "#1976d2" : "gray",
//                                             }}
//                                         >
//                                             <PercentIcon />
//                                         </IconButton>
//                                     </InputAdornment>
//                                     <InputAdornment position="end">
//                                         <IconButton
//                                             onClick={() => setSelected("dollar")}
//                                             sx={{
//                                                 color: selected === "dollar" ? "#1976d2" : "gray",
//                                             }}
//                                         >
//                                             <AttachMoneyIcon />
//                                         </IconButton>
//                                     </InputAdornment>
//                                 </>
//                             ),
//                         }}
//                     />
//                     <TextField
//                         label="Từ ngày"
//                         type="datetime-local"
//                         required
//                         size="small"
//                         fullWidth
//                         InputLabelProps={{ shrink: true }}
//                         placeholder="DD-MM-YYYY hh:mm:ss"
//                         sx={{ mb: 2 }}
//                     />
//                     <TextField
//                         label="Đến ngày"
//                         type="datetime-local"
//                         required
//                         size="small"
//                         fullWidth
//                         InputLabelProps={{ shrink: true }}
//                         placeholder="DD-MM-YYYY hh:mm:ss"
//                         sx={{ mb: 2 }}
//                     />

//                     <Button
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         sx={{ mt: 2 }}
//                         onClick={() => alert("Đợt giảm giá mới được tạo!")}
//                     >
//                         Tạo mới
//                     </Button>
//                 </Box>

//                 {/* Bảng sản phẩm chiếm 60% */}
//                 <Box sx={{ flex: "0 0 60%", maxWidth: "60%" }}>
//                     <TextField
//                         placeholder="Tìm tên sản phẩm"
//                         variant="outlined"
//                         size="small"
//                         fullWidth
//                         sx={{ mb: 2 }}
//                     />
//                     <TableContainer component={Paper}>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell padding="checkbox">
//                                         <Checkbox
//                                             checked={selectAll}
//                                             onChange={handleSelectAll}
//                                         />
//                                     </TableCell>
//                                     <TableCell>STT</TableCell>
//                                     <TableCell>Tên sản phẩm</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {products.map((product, index) => (
//                                     <TableRow key={product.id}>
//                                         <TableCell padding="checkbox">
//                                             <Checkbox
//                                                 checked={selectedProducts.includes(product.id)}
//                                                 onChange={() => handleSelectProduct(product.id)}
//                                             />
//                                         </TableCell>
//                                         <TableCell>{index + 1}</TableCell>
//                                         <TableCell>{product.name}</TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>

//                     {/* Phân trang */}
//                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                             <Typography variant="body2">Xem</Typography>
//                             <Select value={rowsPerPage} onChange={(e) => handleChangeRowsPerPage(e)} size="small" sx={{ minWidth: "60px" }}>
//                                 <MenuItem value={1}>1</MenuItem>
//                                 <MenuItem value={5}>5</MenuItem>
//                                 <MenuItem value={10}>10</MenuItem>
//                                 <MenuItem value={15}>15</MenuItem>
//                                 <MenuItem value={20}>20</MenuItem>
//                                 <MenuItem value={25}>25</MenuItem>
//                             </Select>
//                             <Typography variant="body2">phiếu giảm giá</Typography>
//                         </Box>

//                         {totalItems > 0 && (
//                             <Pagination
//                                 count={Math.max(1, Math.ceil(totalItems / rowsPerPage))}
//                                 page={page + 1}
//                                 onChange={(event, newPage) => handleChangePage(newPage - 1)}
//                                 color="primary"
//                             />
//                         )}
//                     </Box>
//                 </Box>
//             </Box>

//             {renderProductDetails()}
//         </Box>
//     );
// };

// export default EditDiscountEvent;
