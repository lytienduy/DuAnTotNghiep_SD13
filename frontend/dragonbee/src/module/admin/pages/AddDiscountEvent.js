// import axios from "axios";
// import { useEffect, useState } from "react";
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

// const AddDiscountEvent = () => {
//     const navigate = useNavigate(); // Tạo biến navigate để điều hướng
//     const [selectedProducts, setSelectedProducts] = useState([]);
//     const [selectedProductDetails, setSelectedProductDetails] = useState([]);
//     const [selectAll, setSelectAll] = useState(false);
//     const [selected, setSelected] = useState("percent");
//     const [data, setData] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [totalItems, setTotalItems] = useState(0);
//     const [products, setProducts] = useState([]);
//     const [productDetails, setProductDetails] = useState([]);
//     const [searchKeyword, setSearchKeyword] = useState("");
//     const [chiTietSanPham, setChiTietSanPham] = useState([]);
//     const [pageSpct, setPageSpct] = useState(0);
//     const [totalItemsSpct, setTotalItemsSpct] = useState(0);
//     const [rowsPerPageSpct, setRowsPerPageSpct] = useState(5);


//     useEffect(() => {
//         if (selectedProducts.length > 0) {
//             const productIds = selectedProducts.map(productId => parseInt(productId));
//             console.log("Fetching product details for IDs:", productIds); // Xem ID của sản phẩm đã chọn
//             fetch(`http://localhost:8080/api/dot-giam-gia/${productIds.join(',')}/chi-tiet?page=${pageSpct}&size=${rowsPerPageSpct}`)
//                 .then((res) => res.json())
//                 .then((data) => {
//                     console.log("Fetched Product Details:", data);
//                     setChiTietSanPham(data); // Vì data là mảng trực tiếp, không có .content
//                     setTotalItemsSpct(data.length); // Lấy tổng số lượng sản phẩm
//                     setProductDetails(data);
//                 })
//                 .catch((err) => console.error("Lỗi khi fetch chi tiết sản phẩm:", err));
//         } else {
//             setChiTietSanPham([]);
//             setTotalItemsSpct(0);
//         }
//     }, [selectedProducts, pageSpct, rowsPerPageSpct]);

//     const fetchProducts = async (keyword = "") => {
//         try {
//             const response = await axios.get(`http://localhost:8080/api/dot-giam-gia/tong-so-luong`, {
//                 params: { keyword }
//             });
//             setProducts(response.data);
//         } catch (error) {
//             console.error("Lỗi khi load sản phẩm:", error);
//         }
//     };

//     useEffect(() => {
//         fetchProducts(searchKeyword);
//     }, [searchKeyword]);
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

//     // Xử lý chọn tất cả sản phẩm
//     const handleSelectAll = (event) => {
//         const isChecked = event.target.checked;
//         setSelectAll(isChecked);

//         if (isChecked && Array.isArray(products)) {
//             const allProductIds = products.map((product) => product.id);
//             setSelectedProducts(allProductIds);
//         } else {
//             setSelectedProducts([]);
//         }
//     };

//     // Xử lý chọn từng sản phẩm
//     const handleSelectProduct = (productId) => {
//         if (selectedProducts.includes(productId)) {
//             setSelectedProducts(selectedProducts.filter((id) => id !== productId));
//         } else {
//             setSelectedProducts([...selectedProducts, productId]);
//         }
//     };

//     const handleSelectAllSpct = (event) => {
//         if (event.target.checked) {
//             // Chọn tất cả SPCT: map ra danh sách ID
//             const allSpctIds = productDetails.map((ctsp) => ctsp.id);
//             setSelectedProductDetails(allSpctIds);
//         } else {
//             // Bỏ chọn tất cả SPCT
//             setSelectedProductDetails([]);
//         }
//     };

//     const handleSelectProductDetail = (spctId) => {
//         if (selectedProductDetails.includes(spctId)) {
//             setSelectedProductDetails(selectedProductDetails.filter(id => id !== spctId));
//         } else {
//             setSelectedProductDetails([...selectedProductDetails, spctId]);
//         }
//     };

//     const handleChangePageSpct = (newPage) => {
//         setPageSpct(newPage);
//     };

//     const handleRowsPerPageChangeSpct = (event) => {
//         setRowsPerPageSpct(event.target.value);
//         setPageSpct(0); // Reset lại trang khi thay đổi số lượng sản phẩm mỗi trang
//     };

//     // Render chi tiết sản phẩm đã chọn
//     const renderProductDetails = () => {
//         if (chiTietSanPham.length === 0) {
//             return <Typography></Typography>; // Nếu không có dữ liệu, hiển thị thông báo này
//         }

//         return (
//             <Box mt={4} marginRight={-3}>
//                 <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//                     Chi tiết sản phẩm
//                 </Typography>
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell padding="checkbox">
//                                     <Checkbox
//                                         checked={
//                                             productDetails.length > 0 &&
//                                             selectedProductDetails.length === productDetails.length
//                                         }
//                                         indeterminate={
//                                             selectedProductDetails.length > 0 &&
//                                             selectedProductDetails.length < productDetails.length
//                                         }
//                                         onChange={handleSelectAllSpct}
//                                     />
//                                 </TableCell>
//                                 <TableCell sx={{fontWeight:'bold'}}>STT</TableCell>
//                                 <TableCell sx={{fontWeight:'bold'}}>Tên sản phẩm</TableCell>
//                                 <TableCell align="center" sx={{fontWeight:'bold'}}>Danh mục</TableCell>
//                                 <TableCell align="center" sx={{fontWeight:'bold'}}>Thương hiệu</TableCell>
//                                 <TableCell align="center" sx={{fontWeight:'bold'}}>Màu sắc</TableCell>
//                                 <TableCell align="center" sx={{fontWeight:'bold'}}>Kiểu dáng</TableCell>
//                                 <TableCell align="center" sx={{fontWeight:'bold'}}>Số lượng</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {chiTietSanPham.map((ctsp, index) => (
//                                 <TableRow key={ctsp.id}>
//                                     <TableCell padding="checkbox">
//                                         <Checkbox
//                                             checked={selectedProductDetails.includes(ctsp.id)}
//                                             onChange={() => handleSelectProductDetail(ctsp.id)}
//                                         />
//                                     </TableCell>
//                                     <TableCell sx={{fontWeight:'bold'}}>{index + 1}</TableCell>
//                                     <TableCell>{ctsp.tenSanPhamChiTiet}</TableCell>
//                                     <TableCell align="center">{ctsp.danhMuc}</TableCell>
//                                     <TableCell align="center">{ctsp.thuongHieu}</TableCell>
//                                     <TableCell align="center">{ctsp.mauSac}</TableCell>
//                                     <TableCell align="center">{ctsp.kieuDang}</TableCell>
//                                     <TableCell align="center">{ctsp.soLuong}</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//                 {/* Phân trang
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                         <Typography variant="body2" sx={{ mr: 1 }}>
//                             Xem
//                         </Typography>
//                         <Select
//                             size="small"
//                             value={rowsPerPageSpct}
//                             onChange={handleRowsPerPageChangeSpct}
//                             sx={{ width: "70px", mr: 1 }}
//                         >
//                             <MenuItem value={5}>5</MenuItem>
//                             <MenuItem value={10}>10</MenuItem>
//                             <MenuItem value={15}>15</MenuItem>
//                         </Select>
//                         <Typography variant="body2">sản phẩm</Typography>
//                     </Box>
    
//                     {totalItemsSpct > 0 && (
//                         <Pagination
//                             count={Math.max(1, Math.ceil(totalItemsSpct / rowsPerPageSpct))}
//                             page={pageSpct + 1} // Vì Pagination bắt đầu từ trang 1, nên phải cộng 1
//                             onChange={(event, newPage) => handleChangePageSpct(newPage - 1)} // Cộng 1 vì hàm onChange nhận giá trị bắt đầu từ 1
//                             color="primary"
//                         />
//                     )}
//                 </Box> */}
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
//                         / Tạo Đợt Giảm Giá
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
//                         placeholder="Tìm mã hoặc tên sản phẩm"
//                         variant="outlined"
//                         size="small"
//                         fullWidth
//                         sx={{ mb: 2 }}
//                         value={searchKeyword}
//                         onChange={(e) => setSearchKeyword(e.target.value)}
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
//                                     <TableCell sx={{fontWeight:'bold'}}>STT</TableCell>
//                                     <TableCell sx={{fontWeight:'bold'}}>Tên sản phẩm</TableCell>
//                                     <TableCell align="center" sx={{fontWeight:'bold'}}>Số lượng</TableCell>
//                                 </TableRow>
//                             </TableHead>

//                             <TableBody>
//                                 {products
//                                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                     .map((product, index) => (
//                                         <TableRow key={product.id}>
//                                             <TableCell padding="checkbox">
//                                                 <Checkbox
//                                                     checked={selectedProducts.includes(product.id)}
//                                                     onChange={() => handleSelectProduct(product.id)}
//                                                 />
//                                             </TableCell>
//                                             <TableCell sx={{fontWeight:'bold'}}>{page * rowsPerPage + index + 1}</TableCell>
//                                             <TableCell>{product.tenSanPham} ({product.ma})</TableCell>
//                                             <TableCell align="center">{product.tongSoLuong}</TableCell>
//                                         </TableRow>
//                                     ))}
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

// export default AddDiscountEvent;
