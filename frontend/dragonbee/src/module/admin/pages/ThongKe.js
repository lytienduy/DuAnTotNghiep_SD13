import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Tooltip as MuiTooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SaveAlt } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const revenueData = [
  {
    label: "Doanh thu hôm nay",
    value: "19,777,500 VND",
    productsSold: "150 sản phẩm",
    successfulOrders: "120 đơn hàng",
  },
  {
    label: "Doanh thu tháng này",
    value: "84,107,493 VND",
    productsSold: "3,200 sản phẩm",
    successfulOrders: "2,800 đơn hàng",
  },
  {
    label: "Doanh thu năm nay",
    value: "1,024,500,000 VND",
    productsSold: "40,500 sản phẩm",
    successfulOrders: "38,000 đơn hàng",
  },
];

const monthlyRevenue = [
  { month: "Tháng 1", revenue: 50000000 },
  { month: "Tháng 2", revenue: 60000000 },
  { month: "Tháng 3", revenue: 75000000 },
  { month: "Tháng 4", revenue: 90000000 },
  { month: "Tháng 5", revenue: 100000000 },
  { month: "Tháng 6", revenue: 95000000 },
  { month: "Tháng 7", revenue: 105000000 },
  { month: "Tháng 8", revenue: 110000000 },
  { month: "Tháng 9", revenue: 120000000 },
  { month: "Tháng 10", revenue: 130000000 },
  { month: "Tháng 11", revenue: 140000000 },
  { month: "Tháng 12", revenue: 150000000 },
];
const topProducts = [
  { name: "Quần Âu Nam Công Sở", sold: 500 },
  { name: "Quần Âu Slim Fit", sold: 450 },
  { name: "Quần Âu Hàn Quốc", sold: 400 },
  { name: "Quần Âu Dáng Suông", sold: 380 },
  { name: "Quần Âu Xám Ghi", sold: 350 },
];

const lowStockProducts = [
  { name: "Quần Âu Nam Công Sở", quantity: 5 },
  { name: "Quần Âu Slim Fit", quantity: 8 },
  { name: "Quần Âu Hàn Quốc", quantity: 10 },
  { name: "Quần Âu Dáng Suông", quantity: 12 },
  { name: "Quần Âu Xám Ghi", quantity: 15 },
];

const stockProducts = [
  { name: "Quần Âu Nam Công Sở", quantity: 120 },
  { name: "Quần Âu Slim Fit", quantity: 100 },
  { name: "Quần Âu Hàn Quốc", quantity: 90 },
  { name: "Quần Âu Dáng Suông", quantity: 85 },
  { name: "Quần Âu Xám Ghi", quantity: 80 },
];

const orderStatusData = [
  { name: "Đã giao", value: 120 },
  { name: "Đang giao", value: 60 },
  { name: "Chờ xử lý", value: 40 },
  { name: "Hủy bỏ", value: 10 },
];

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#F44336"];

const RevenueCard = ({ label, value, productsSold, successfulOrders }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      borderRadius: 2,
      minWidth: 340,
      textAlign: "center",
      backgroundColor: "white",
    }}
  >
    <Typography variant="h6" fontWeight="bold" color="primary">
      {label}
    </Typography>
    <Typography variant="h5" fontWeight="bold" color="#0D47A1" mt={1}>
      {value}
    </Typography>
    <Typography variant="body1" mt={1}>
      {productsSold}
    </Typography>
    <Typography variant="body1">{successfulOrders}</Typography>
  </Paper>
);

const ThongKe = () => {
  const [chartType, setChartType] = useState("bar");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState(monthlyRevenue);
  const [selected, setSelected] = useState("TÙY CHỈNH", "NGÀY");

  const handleExport = () => {
    console.log("Xuất Excel...");
  };

  const handleSearch = () => {
    const newData = monthlyRevenue.filter(
      (data) => data.month >= fromDate && data.month <= toDate
    );
    setFilteredData(newData.length > 0 ? newData : monthlyRevenue);
  };

  const [showCustomRevenue, setShowCustomRevenue] = useState(false);

  const handleSelect = (item) => {
    setSelected(item);
    setShowCustomRevenue(item === "TÙY CHỈNH");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Thống Kê
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {revenueData.map((item, index) => (
          <RevenueCard key={index} {...item} />
        ))}
      </Box>

      <Box>
        {/* Hiển thị ô doanh thu tùy chỉnh */}
        {showCustomRevenue && (
          <Box
            sx={{
              mt: 2,
              minWidth: 900,
              p: 2,
              backgroundColor: "white",
              borderRadius: 2,
              textAlign: "center",
              color: "black",
              fontWeight: "bold",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              border: "1px solid #ddd",
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="#1976D2" mt={1}>
              Doanh Thu Tùy chỉnh
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#0D47A1" ,mt:1}}
            >
              19,267,000 VND
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}
            >
              <Box>
                <Typography variant="body2">Sản phẩm</Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  25
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2">Đơn thành công</Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  6
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2">Đơn hủy</Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  1
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2">Đơn trả</Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  2
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap={1}
        mt={4}
        mb={0}
      >
        {["NGÀY", "TUẦN", "THÁNG", "NĂM", "TÙY CHỈNH"].map((item) => (
          <Button
            key={item}
            variant={selected === item ? "contained" : "outlined"}
            onClick={() => handleSelect(item)}
            sx={{
              backgroundColor: selected === item ? "#1976D2" : "white",
              color: selected === item ? "white" : "#1976D2",
              borderColor: "#1976D2",
              borderRadius: 1,
              px: 2.5,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: selected === item ? "#1565C0" : "#E3F2FD",
              },
            }}
          >
            {item}
          </Button>
        ))}

        {/* Nút xuất Excel */}
        <Button
          variant="outlined" // 👈 Chuyển thành "outlined" để có viền
          color="success"
          onClick={handleExport}
          sx={{
            borderRadius: 1,
            px: 3,
            fontWeight: "bold",
            borderColor: "#2E7D32", // 👈 Viền xanh lá
            color: "#2E7D32", // 👈 Chữ xanh lá
            backgroundColor: "white", // 👈 Nền trắng
            display: "flex",
            alignItems: "center", // 👈 Căn giữa icon và chữ
            gap: 1, // 👈 Tạo khoảng cách giữa icon và chữ
            "&:hover": {
              backgroundColor: "#E8F5E9", // 👈 Màu nền nhạt khi hover
              borderColor: "#1B5E20",
            },
          }}
        >
          <FileDownloadIcon fontSize="small" /> {/* 👈 Thêm icon */}
          Xuất Excel
        </Button>
      </Box>

      <Box
        component={Paper}
        elevation={3}
        sx={{
          backgroundColor: "white",
          height: 530,
          borderRadius: 2,
          marginTop: "0px",
        }}
      >
        <Box sx={{ mt: 0, height: 400, width: "100%" }}>
          <Box sx={{ mt: 2, mb: 3, pl: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ pt: 1 }}>
              Biểu Đồ Thống Kê
            </Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-start",
                ml: 14,
              }}
            >
              <MuiTooltip
                title={chartType === "bar" ? "Biểu đồ cột" : "Biểu đồ đường"}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    setChartType(chartType === "bar" ? "line" : "bar")
                  }
                  sx={{
                    ml: 2,
                    borderColor: "#0D47A1",
                    color: "#0D47A1",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "12px",
                    padding: "4px 8px",
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "#E3F2FD",
                      borderColor: "#0D47A1",
                    },
                  }}
                >
                  {chartType === "bar" ? "📊" : "📈"}
                </Button>
              </MuiTooltip>
            </Box>

            <Grid item sx={{ ml: 73 }}>
              <TextField
                label="Từ ngày"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": { height: "35px", fontSize: "14px" },
                  "& .MuiInputLabel-root": { fontSize: "12px" },
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Đến ngày"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": { height: "35px", fontSize: "14px" },
                  "& .MuiInputLabel-root": { fontSize: "12px" },
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ height: "35px" }}
              >
                Tìm kiếm
              </Button>
            </Grid>
          </Grid>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
              data={filteredData}
              margin={{ top: 20, right: 50, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  return (
                    <div style={{ background: "#fff", padding: 10, border: "1px solid #ccc" }}>
                      <p>{payload[0].payload.month}</p>
                      <p>Doanh thu: {payload[0].value.toLocaleString()} VND</p>
                    </div>
                  );
                }} 
              />
              <Legend />
              <Bar dataKey="revenue" fill="#0D47A1" barSize={40} />
            </BarChart>            
            ) : (
              <LineChart
                data={filteredData}
                margin={{ top: 20, right: 50, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0D47A1"
                  strokeWidth={2}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {/* Hàng 1: Top 5 sản phẩm bán chạy & Trạng thái đơn hàng */}
          <Grid container item spacing={2} xs={12}>
            <Grid item xs={12} md={6}>
              <TableContainer component={Paper}>
                <Typography variant="h6" fontWeight="bold" p={2}>
                  Top Sản Phẩm Bán Chạy Trong Tháng
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Đã bán</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell align="right">{row.sold}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Trạng Thái Đơn Hàng
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Hàng 2: 5 sản phẩm sắp hết hàng & 5 sản phẩm tồn kho */}
          <Grid container item spacing={2} xs={12}>
            <Grid item xs={12} md={6}>
              <TableContainer component={Paper}>
                <Typography variant="h6" fontWeight="bold" p={2}>
                  Top Sản Phẩm Sắp Hết Hàng Trong Tháng
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockProducts.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <TableContainer component={Paper}>
                <Typography variant="h6" fontWeight="bold" p={2}>
                  Top Sản Phẩm Tồn Kho Trong Tháng
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockProducts.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ThongKe;
