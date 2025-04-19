import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, TextField, Button, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, FormControl, Box, Stack, IconButton, FormHelperText, Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import HoaDonPrint from "./HoaDonPrint";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";


const HoaDon = () => {
  // Khái báo useState
  const [tabValue, setTabValue] = useState(0); //Giá trị TabValue
  const [orders, setOrders] = useState([]); //Danh sách hóa đơn
  const [loading, setLoading] = useState(true); //Giá trị loading dữ liệu
  const [typeFilter, setTypeFilter] = useState("all"); // Giá trị của bộ lọc loại hóa đơn
  const [fromDate, setFromDate] = useState(""); //Giá trị của bộ lọc fromDate 
  const [toDate, setToDate] = useState(""); //Giá trị của bộ lọc toDate 
  const [searchText, setSearchText] = useState(""); //Giá trị của text tìm kiếm
  const [dateError, setDateError] = useState(false); // Boolean báo lỗi của bộ lọc khoảng ngày
  const [counts, setCounts] = useState({}); // List những count số lượng hóa đơn theo danh sách trạng thái(Vị trí listCount liên quan trong backend theo listTrangThai trong backend)

  //Thông báo
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#1976D2", // Màu nền xanh đẹp hơn
        color: "white", // Chữ trắng nổi bật
        fontSize: "14px", // Nhỏ hơn một chút
        fontWeight: "500",
        borderRadius: "8px",
      }
    });
  };
  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#D32F2F", // Màu đỏ cảnh báo
        color: "white", // Chữ trắng nổi bật
        fontSize: "14px", // Nhỏ hơn một chút
        fontWeight: "500",
        borderRadius: "8px",
      }
    });
  };


  //Export Excel
  const handleExportExcel = async () => {
    if (!orders || orders.length === 0) {
      showErrorToast("Không có dữ liệu xuất file Excel")
      return;
    }


    // Chuẩn bị dữ liệu Excel
    const data = orders.map((order, index) => ({
      STT: index + 1,
      "Mã hóa đơn": order.ma,
      "Người nhận hàng": order.nguoiNhanHang,
      "Loại hóa đơn": order.loaiDon,
      "Ngày tạo": new Date(order.ngayTao).toLocaleString("vi-VN"),
      "Trạng thái": order.trangThai,
      "Số tiền thanh toán": (order?.tongTien ?? 0).toLocaleString("vi-VN") + " đ",
    }));

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh Sách Hóa Đơn");

    // Xuất file Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Mở File Explorer để chọn vị trí và đặt tên file
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "hoa-don.xlsx",
        types: [
          {
            description: "Excel Files",
            accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      showSuccessToast("Xuất file Excel thành công");
    } catch (error) {
      showErrorToast("Đã có lỗi xảy ra khi xuất file Excel")
    }
  };


  //In hóa đơn
  const [hoaDon, setHoaDon] = useState(null);  // state chứa dữ liệu hóa đơn đã chọn

  const handlePrint = async (id) => {
    // Lấy thông tin hóa đơn từ API hoặc dữ liệu có sẵn và gán vào state
    try {
      const response = await axios.get(`http://localhost:8080/hoa-don/${id}`);
      if (response.data) {
        setHoaDon(response.data);

        setTimeout(() => {
          const printContent = document.getElementById("hoaDonPrint");
          if (!printContent) {
            showErrorToast("Không tìm thấy nội dung hóa đơn để in!");
            return;
          }

          const printWindow = window.open("", "_blank");
          printWindow.document.write(printContent.innerHTML);
          printWindow.document.close();

          // Thêm sự kiện khi in xong
          printWindow.onafterprint = () => {
            showSuccessToast("In hóa đơn thành công!");
          };

          printWindow.print();
        }, 500);
      }
    } catch (error) {
      showErrorToast("Lỗi khi tải hóa đơn, vui lòng thử lại!");
      console.error("Lỗi khi lấy dữ liệu hóa đơn:", error);
    }
  };

  // Lấy CSS hóa đơn cho từng trạng thái
  const getStatusStyles = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return { backgroundColor: "#FFF9C4", color: "#9E9D24" }; // Vàng nhạt
      case "Đã xác nhận":
        return { backgroundColor: "#C8E6C9", color: "#388E3C" }; // Xanh lá nhạt
      case "Chờ giao hàng":
        return { backgroundColor: "#FFE0B2", color: "#E65100" }; // Cam nhạt
      case "Đang vận chuyển":
        return { backgroundColor: "#BBDEFB", color: "#1976D2" }; // Xanh dương nhạt
      case "Đã giao hàng":
        return { backgroundColor: "#DCEDC8", color: "#689F38" }; // Xanh lá nhạt hơn
      case "Đã thanh toán":
        return { backgroundColor: "#E1BEE7", color: "#8E24AA" }; // Tím nhạt
      case "Chờ thanh toán":
        return { backgroundColor: "#FFCCBC", color: "#D84315" }; // Đỏ cam nhạt
      case "Hoàn thành":
        return { backgroundColor: "#CFD8DC", color: "#455A64" }; // Xám nhạt
      case "Đã hủy":
        return { backgroundColor: "#FFCDD2", color: "#C62828" }; // Đỏ nhạt
      default:
        return { backgroundColor: "#E3F2FD", color: "#000" }; // Màu mặc định (xanh siêu nhẹ)
    }
  };

  // List trạng thái hóa đơn
  const tabLabels = typeFilter === "Online" ?
    [
      "TẤT CẢ",
      "CHỜ XÁC NHẬN",
      "ĐÃ XÁC NHẬN",
      "CHỜ GIAO HÀNG",
      "ĐANG VẬN CHUYỂN",
      "ĐÃ GIAO HÀNG", "CHỜ THANH TOÁN",
      "ĐÃ THANH TOÁN",
      "HOÀN THÀNH",
      "ĐÃ HỦY",
      "Chờ hoàn tiền"
    ] : [
      "TẤT CẢ",
      "CHỜ THÊM SẢN PHẨM",
      "CHỜ XÁC NHẬN",
      "ĐÃ XÁC NHẬN",
      "CHỜ GIAO HÀNG",
      "ĐANG VẬN CHUYỂN",
      "ĐÃ GIAO HÀNG",
      "CHỜ THANH TOÁN",
      "ĐÃ THANH TOÁN",
      "HOÀN THÀNH",
      "ĐÃ HỦY",
      "Chờ hoàn tiền"
    ];


  //Dùng để chuyển trang
  const navigate = useNavigate();
  const handleCreateInvoice = () => {
    navigate("/admin/banTaiQuay"); // Chuyển đến trang bán hàng tại quầy
  };

  // Gắn funtion setTimeOut cho ô tìm kiếm searchText cứ 800ms thì mới chạy chức năng lọc háo đơn
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders();
      fetchCounts();
    }, 800); // Chờ 800ms sau khi user dừng nhập
    return () => clearTimeout(handler); // Hủy timeout nếu user nhập tiếp
  }, [searchText]);


  // Gắn funtion gọi lấy hóa đơn fetchOrders khi toDate hoặc fromDate thay dổi
  useEffect(() => {
    if (dateError === false) { // Nếu dateError mà mang giá trị false là bộ lọc khoảng ngày đang KHÔNG LỖI 
      if (!fromDate && !toDate) { //Nếu cả fromDate và toDate đều rỗng
        fetchOrders();
        fetchCounts();
      } else if (toDate && fromDate) { //Nếu cả fromDate và toDate đều đủ điều kiện
        fetchOrders();
        fetchCounts();
      }
    }
  }, [toDate, fromDate]);


  //Hàm lấy số lượng hóa đơn theo kèm lọc theo loai đơn(typeFilter)
  const fetchCounts = async () => {
    let apiUrl = "http://localhost:8080/hoa-don/count";
    // Xây dựng query string
    const params = new URLSearchParams();

    params.append("trangThai", tabLabels[tabValue]);// truyền vào textTrangThai theo valueTab

    params.append("loaiDon", typeFilter);//Truyền vào loại đơn

    if (fromDate && toDate) { // Khi cả fromDate và toDate hợp lệ
      params.append("tuNgay", fromDate);
      params.append("denNgay", toDate);
    } else if (!fromDate && !toDate) {
      const today = new Date(); // Lấy ngày hiện tại
      const formattedDate = today.toISOString().split("T")[0]; // Lấy phần yyyy-MM-dd
      params.append("tuNgay", formattedDate);
      params.append("denNgay", formattedDate);
    }

    if (searchText.trim()) params.append("timKiem", searchText);//Khi searchText không rỗng

    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}?${params.toString()}`);//Gọi api bằng axiosGet
      setCounts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu số lượng hóa đơn:", error);
    } finally {
      setLoading(false);
    }
  };

  //Khi tabValue thay đổi giá trị
  useEffect(() => {
    fetchOrders();
  }, [tabValue]);

  //KHi thay dổi typeFilter thì thay đổi danh sách hóa đơn hiển thị và count đếm số lượng trạng thái
  useEffect(() => {
    setTabValue(0);
    fetchOrders();
    fetchCounts();
  }, [typeFilter]);

  const fetchOrders = async () => {
    let apiUrl = "http://localhost:8080/hoa-don/loc";
    // Xây dựng query string
    const params = new URLSearchParams();

    params.append("trangThai", tabLabels[tabValue]);// truyền vào textTrangThai theo valueTab

    params.append("loaiDon", typeFilter);//Truyền vào loại đơn

    if (fromDate && toDate) { // Khi cả fromDate và toDate hợp lệ
      params.append("tuNgay", fromDate);
      params.append("denNgay", toDate);
    } else if (!fromDate && !toDate) {
      const today = new Date(); // Lấy ngày hiện tại
      const formattedDate = today.toISOString().split("T")[0]; // Lấy phần yyyy-MM-dd
      params.append("tuNgay", formattedDate);
      params.append("denNgay", formattedDate);
    }

    if (searchText.trim()) params.append("timKiem", searchText);//Khi searchText không rỗng

    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}?${params.toString()}`);//Gọi api bằng axiosGet
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };
  //Phân trang
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số lượng mỗi trang
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(orders.length / rowsPerPage);

  // Nhóm trang (hiển thị tối đa 5 trang)
  const pagesToShow = 5;
  const startPage = Math.floor(page / pagesToShow) * pagesToShow;
  const endPage = Math.min(startPage + pagesToShow, totalPages);
  const paginatedOrders = orders.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleChangePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
        {/* Thanh tìm kiếm */}
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Nhập mã hóa đơn hoặc tên, SĐT người nhận"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon style={{ marginRight: 8 }} /> }}
        />

        {/* Bộ lọc ngày */}


        <div style={{ display: "flex", gap: "10px" }}>
          {/* From Date */}
          <TextField
            label="Từ ngày"
            variant="outlined"
            size="small"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              if (toDate && e.target.value > toDate) {
                setDateError(true);
              } else {
                setDateError(false);
              }
              setFromDate(e.target.value);
            }}
            error={dateError}
          />

          {/* To Date */}
          <TextField
            label="Đến ngày"
            variant="outlined"
            size="small"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              if (e.target.value && fromDate > e.target.value) {
                setDateError(true);
              } else {
                setDateError(false);
              }
              setToDate(e.target.value);
            }}
            error={dateError}
          />
        </div>

        {/* Hiển thị lỗi nếu có */}
        {dateError && (
          <FormHelperText error >Ngày kết thúc không thể nhỏ hơn ngày bắt đầu</FormHelperText>
        )}



        {/* Bộ lọc loại hóa đơn */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          {/* Bộ lọc loại đơn */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Typography fontSize={14} fontWeight={500} sx={{ mb: 0.5 }}>Loại đơn</Typography>
            <Select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setLoading(true);
              }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Tại quầy">Tại quầy</MenuItem>
            </Select>
          </FormControl>

          {/* Nhóm nút chức năng */}
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={handleCreateInvoice} sx={{ backgroundColor: "rgb(52 152 234)", color: "white" }}>
              Tạo hóa đơn
            </Button>
            {/* <Button variant="outlined" color="primary">Quét mã</Button> */}
            <Button variant="outlined" color="success" onClick={handleExportExcel}>
              Export Excel
            </Button>
          </Stack>
        </Stack>
      </div>

      {/* Table hiển thị hóa đơn */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}//Bắt buộc có 2 tham số 
        variant="scrollable"
        scrollButtons={false} // Ẩn mũi tên cuộn
        allowScrollButtonsMobile={false} // Ngăn xuất hiện trên mobile
        sx={{
          width: "100%",
          minHeight: 48,
          overflow: "visible", // Giữ tab không bị tụt vào trong
        }}
      >
        {tabLabels.map((label, index) => {
          const count = counts[index] || 0;
          // return <Tab key={index} label={`${label} (${count})`} sx={{ flexShrink: 0 }} />;
          return <Tab
            key={index}
            label={
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {label}
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    padding: "1px 4px",
                    borderRadius: "8px",
                    minWidth: "16px",
                    height: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    position: "relative",
                    top: "-7px", // Đẩy count lên cao một chút
                  }}
                >
                  {count}
                </Typography>
              </span>
            }
            sx={{ flexShrink: 0 }}
          />

        })}
      </Tabs>

      {/* Table hiển thị */}
      <TableContainer component={Paper} style={{ marginTop: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Mã</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Khách hàng</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Loại hóa đơn</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Ngày tạo</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Số tiền thanh toán</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} style={{ textAlign: "center" }}>Đang tải dữ liệu...</TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{order.ma}</TableCell>
                  <TableCell
                    align="center" >
                    <Box sx={{
                      backgroundColor: order?.maKhachHang === null ? "#FFE0B2" : "#D1E8FF",
                      color: order?.maKhachHang === null ? "#E65100" : "#0D47A1",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      fontWeight: "normal",
                      display: "inline-block", // Giúp box ôm sát nội dung
                      width: "fit-content",    // Chiều rộng chỉ bằng nội dung
                      maxWidth: "100%"
                    }}>
                      {order?.maKhachHang === null
                        ? "Khách vãng lai"
                        : `${order.tenKhachHang} - ${order.sdtKhachHang}`}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{
                      backgroundColor: order.loaiDon === "Online" ? "#E3F2FD" : "#FFEBEE",
                      color: order.loaiDon === "Online" ? "#1976D2" : "#D32F2F",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      fontWeight: "normal"
                    }}>
                      {order.loaiDon}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{new Date(order.ngayTao).toLocaleString("vi-VN")}</TableCell>
                  <TableCell align="center">
                    <Box sx={{
                      ...getStatusStyles(order.trangThai), // Gọi hàm để lấy CSS tương ứng
                      borderRadius: "8px",
                      padding: "4px 10px",
                      fontWeight: "normal"
                    }}>
                      {order.trangThai}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{(order?.tongTien ?? 0).toLocaleString("vi-VN")} đ</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" size="small"
                        onClick={() => navigate(`/admin/hoaDon/${order.id}`)}
                      // onClick={() => xemHoaDonChiTiet(order.id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="success" size="small" onClick={() => handlePrint(order.id)}>
                        <PrintIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* In hóa đơn */}
      {hoaDon && (
        <Box id="hoaDonPrint" style={{ display: "none" }}> {/* Thay display: none bằng block */}
          <HoaDonPrint hoaDon={hoaDon} />
        </Box>
      )}


      {/* Phân trang */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={2}>
        {/* Bên trái: Chọn số sản phẩm hiển thị */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <span>Xem</span>
          <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(e.target.value)} size="small">
            {[5, 10, 20].map((num) => (
              <MenuItem key={num} value={num}>{num}</MenuItem>
            ))}
          </Select>
          <span>hóa đơn</span>
        </Stack>

        {/* Bên phải: Các nút phân trang */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Nút trang trước */}
          <Button
            variant="outlined"
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
            sx={{ borderRadius: "50%", minWidth: 40, width: 40, height: 40 }}
          >
            ‹
          </Button>
          {/* Các số trang */}
          {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "contained" : "outlined"}
              onClick={() => handleChangePage(pageNum)}
              sx={{ borderRadius: "50%", minWidth: 40, width: 40, height: 40 }}
            >
              {pageNum + 1}
            </Button>
          ))}

          {/* Nút trang sau */}
          <Button
            variant="outlined"
            onClick={() => handleChangePage(page + 1)}
            disabled={page + 1 >= totalPages}
            sx={{ borderRadius: "50%", minWidth: 40, width: 40, height: 40 }}
          >
            ›
          </Button>
        </Stack>
      </Stack>
      <ToastContainer /> {/* Quan trọng để hiển thị toast */}

    </div>
  );
};

export default HoaDon;
