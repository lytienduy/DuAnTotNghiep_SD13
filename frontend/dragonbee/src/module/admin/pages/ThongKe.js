import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import OrderStatusPieChart from "./OrderStatusPieChart";
import OutOfStockProducts from "./OutOfStockProducts";
import RevenueGrowthStats from "./RevenueGrowthStats";

import {
  CalendarToday,
  Event,
  DateRange,
  MonetizationOn,
} from "@mui/icons-material";
import axios from "axios";

const RevenueCard = ({
  label,
  value,
  productsSold,
  successfulOrders,
  canceledOrders,
  icon,
}) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      borderRadius: 2,
      minWidth: 570,
      textAlign: "center",
      backgroundColor: "white",
    }}
  >
    <Box mb={1}>{icon}</Box>
    <Typography variant="h6" fontWeight="bold" color="primary">
      {label}
    </Typography>
    <Typography variant="h5" fontWeight="bold" color="#0D47A1" mt={1}>
      {value}
    </Typography>
    <Box display="flex" justifyContent="space-around" mt={2}>
      <Box>
        <Typography variant="body2">Sản phẩm</Typography>
        <Typography variant="h6" fontWeight="bold">
          {productsSold}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2">Đơn thành công</Typography>
        <Typography variant="h6" fontWeight="bold">
          {successfulOrders}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2">Đơn hủy</Typography>
        <Typography variant="h6" fontWeight="bold">
          {canceledOrders}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const ThongKe = () => {
  const [data, setData] = useState({
    today: null,
    week: null,
    month: null,
    year: null,
  });

  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("Ngày");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const [customRevenue, setCustomRevenue] = useState(null); // doanh thu tùy chỉnh

  // State phân trang cho bảng sản phẩm bán chạy
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filters = ["Ngày", "Tuần", "Tháng", "Năm", "Tùy chỉnh"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todayRes, weekRes, monthRes, yearRes] = await Promise.all([
          axios.get("http://localhost:8080/api/thong-ke/today"),
          axios.get("http://localhost:8080/api/thong-ke/week"),
          axios.get("http://localhost:8080/api/thong-ke/month"),
          axios.get("http://localhost:8080/api/thong-ke/year"),
        ]);
        setData({
          today: todayRes.data,
          week: weekRes.data,
          month: monthRes.data,
          year: yearRes.data,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const convertFilter = (filter) => {
    switch (filter.toLowerCase()) {
      case "ngày":
        return "today";
      case "tuần":
        return "week";
      case "tháng":
        return "month";
      case "năm":
        return "year";
      case "tùy chỉnh":
        return "custom";
      default:
        return "today";
    }
  };

  // Hàm gọi API doanh thu tùy chỉnh (custom revenue) nếu filter là "Tùy chỉnh"
  const fetchCustomRevenue = async (startDate, endDate) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/thong-ke/custom-revenue",
        {
          params: { startDate, endDate },
        }
      );
      setCustomRevenue(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy doanh thu tùy chỉnh:", error);
    }
  };

  // Hàm gọi API thống kê sản phẩm bán chạy
  const fetchTopProducts = async (filter) => {
    try {
      if (filter.toLowerCase() === "tùy chỉnh") {
        // Nếu là tùy chỉnh, đảm bảo người dùng nhập đầy đủ ngày
        if (!customStartDate || !customEndDate) return;
        const response = await axios.get(
          `http://localhost:8080/api/top-products/custom`,
          {
            params: {
              startDate: customStartDate,
              endDate: customEndDate,
            },
          }
        );
        setTopProducts(response.data);
      } else {
        const filterEndpoint = convertFilter(filter);
        const response = await axios.get(
          `http://localhost:8080/api/top-products/${filterEndpoint}`
        );
        setTopProducts(response.data);
      }
      setPage(1); // Reset trang mỗi khi filter thay đổi
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm bán chạy:", error);
    }
  };

  // Gọi API mỗi khi filter hoặc ngày tùy chỉnh thay đổi
  useEffect(() => {
    fetchTopProducts(selectedFilter);
    if (selectedFilter === "Tùy chỉnh" && customStartDate && customEndDate) {
      fetchCustomRevenue(customStartDate, customEndDate);
    }
  }, [selectedFilter, customStartDate, customEndDate]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setShowCustomDate(filter === "Tùy chỉnh");
    fetchTopProducts(filter.toLowerCase()); // gọi API khi bấm lọc
  };

  // Phân trang phía client cho topProducts
  const totalItems = topProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const currentProducts = topProducts.slice(startIndex, startIndex + pageSize);

  // Xử lý chuyển trang
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Xử lý thay đổi số bản ghi mỗi trang
  const handleChangePageSize = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const stats = [
    { label: "Hôm nay", key: "today", icon: <CalendarToday color="primary" /> },
    { label: "Tuần này", key: "week", icon: <Event color="success" /> },
    { label: "Tháng này", key: "month", icon: <DateRange color="warning" /> },
    { label: "Năm nay", key: "year", icon: <MonetizationOn color="error" /> },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Thống Kê
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {stats.map((stat) => (
          <Grid item key={stat.key}>
            <RevenueCard
              label={stat.label}
              icon={stat.icon}
              value={
                loading ? (
                  <CircularProgress size={24} />
                ) : (
                  `${new Intl.NumberFormat("vi-VN").format(
                    data[stat.key]?.totalRevenue || 0
                  )} VNĐ`
                )
              }
              productsSold={data[stat.key]?.totalProductsSold || 0}
              successfulOrders={data[stat.key]?.totalCompletedOrders || 0}
              canceledOrders={data[stat.key]?.totalCancelledOrders || 0}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{mt: 3}}>
      {selectedFilter === "Tùy chỉnh" && (
        <Grid item>
          <RevenueCard
            label="Tùy chỉnh"
            icon={<CalendarToday color="primary" />}
            value={
              customRevenue !== null
                ? `${new Intl.NumberFormat("vi-VN").format(
                    customRevenue.totalRevenue || 0
                  )} VNĐ`
                : "Chưa có dữ liệu"
            }
            productsSold={customRevenue?.totalProductsSold || 0}
            successfulOrders={customRevenue?.totalCompletedOrders || 0}
            canceledOrders={customRevenue?.totalCancelledOrders || 0}
          />
        </Grid>
      )}
      </Box>
      

      {/* Bộ lọc */}
      <Box mt={4} p={2} sx={{ backgroundColor: "#FFFFFFFF", borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Bộ lọc
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "contained" : "outlined"}
                sx={{
                  borderRadius: 1,
                  minWidth: 90,
                  color: selectedFilter === filter ? "white" : "inherit",
                  backgroundColor:
                    selectedFilter === filter ? "#1565C0" : "transparent",
                  borderColor: "#1565C0",
                  "&:hover": {
                    backgroundColor:
                      selectedFilter === filter
                        ? "#1565C0"
                        : "rgba(134, 171, 240, 0.1)",
                  },
                }}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </Button>
            ))}
            {showCustomDate && (
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Từ ngày"
                  variant="outlined"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  sx={{ width: 200 }}
                />
                <TextField
                  label="Đến ngày"
                  variant="outlined"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  sx={{ width: 200 }}
                />
              </Stack>
            )}
          </Stack>

          <Button
            variant="outlined"
            color="success"
            sx={{ borderRadius: 1, fontWeight: "bold", minWidth: 120 }}
          >
            EXPORT TO EXCEL
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            <Grid container item spacing={2} xs={12}>
              <Grid item xs={12} md={7}>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Typography variant="h6" fontWeight="bold" p={2}>
                    Danh sách sản phẩm bán chạy theo{" "}
                    {selectedFilter.toLowerCase()}
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>#</b>
                        </TableCell>
                        <TableCell>
                          <b>Ảnh</b>
                        </TableCell>
                        <TableCell>
                          <b>Tên sản phẩm</b>
                        </TableCell>
                        <TableCell>
                          <b>Số lượng bán</b>
                        </TableCell>
                        <TableCell>
                          <b>Giá bán</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topProducts && topProducts.length > 0 ? (
                        topProducts.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <img
                                src={product.imageUrls}
                                alt={product.description}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 5,
                                }}
                              />
                            </TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>{product.totalSold}</TableCell>
                            <TableCell>
                              {new Intl.NumberFormat("vi-VN").format(
                                product.price
                              )}{" "}
                              đ
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <img
                              src="https://tse3.mm.bing.net/th?id=OIP.8Zww1kyLFW31npF4fA1umgHaDt"
                              alt="No Data"
                              width="300"
                              style={{ marginBottom: 16 }}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* Phân trang phía dưới bảng */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  {/* Chọn số sản phẩm mỗi trang */}
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ pl: 1 }}>Xem</Typography>
                    <FormControl size="small">
                      <Select
                        value={pageSize}
                        onChange={handleChangePageSize}
                        sx={{ width: 70 }}
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography>Sản phẩm</Typography>
                  </Stack>

                  {/* Thanh phân trang */}
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                {/* Hiển thị biểu đồ tròn theo filter */}
                <OrderStatusPieChart filter={convertFilter(selectedFilter)} />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={4} p={2} sx={{ backgroundColor: "#FFFFFFFF", borderRadius: 2 }}>
        <Grid container item spacing={2} xs={12}>
          <Grid item xs={12} md={7}>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Box sx={{ p: 2 }}>
                {/* Các thống kê khác ... */}

                {/* Thêm danh sách sản phẩm sắp hết hàng */}
                <OutOfStockProducts />
              </Box>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ p: 2 }}>
              {/* Các thống kê khác ... */}
              <RevenueGrowthStats />
              {/* Các thành phần khác */}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ThongKe;
