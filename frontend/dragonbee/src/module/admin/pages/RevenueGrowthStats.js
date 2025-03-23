import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Stack
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// Icon thanh biểu đồ (có thể thay thế bằng icon khác bạn thích)
import InsertChartIcon from "@mui/icons-material/InsertChart";

const formatNumber = (value) =>
  new Intl.NumberFormat("vi-VN").format(value || 0);

const RevenueGrowthStats = () => {
  const [growthData, setGrowthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/revenue/growth-all")
      .then((res) => {
        setGrowthData(res.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu tăng trưởng:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Hàm hiển thị icon tăng/giảm và màu sắc
  const renderGrowth = (growthValue) => {
    const isPositive = growthValue >= 0;
    return (
      <Box display="flex" alignItems="center">
        {isPositive ? (
          <TrendingUpIcon sx={{ color: "#4caf50", mr: 1 }} />
        ) : (
          <TrendingDownIcon sx={{ color: "#f44336", mr: 1 }} />
        )}
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: isPositive ? "#4caf50" : "#f44336",
          }}
        >
          {Math.abs(growthValue).toFixed(2)}%
        </Typography>
      </Box>
    );
  };

  if (loading) return <Typography>Đang tải dữ liệu...</Typography>;
  if (!growthData) return <Typography>Không có dữ liệu</Typography>;

  return (
    <Paper
      sx={{
        p: 3,
        mt: 3,
        backgroundColor: "#000000", // Nền xanh đậm
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={2}
        sx={{ color: "#e3f2fd" }}
      >
        Tốc độ tăng trưởng của cửa hàng
      </Typography>
      <Stack spacing={1}>
        {/* Doanh thu ngày */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#333333", // xanh vừa
            p: 1,
            borderRadius: 1,
          }}
        >
          {/* Tiêu đề + Icon */}
          <Box display="flex" alignItems="center">
            <InsertChartIcon sx={{ color: "#fff", mr: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#fff" }}>
              Doanh thu ngày
            </Typography>
          </Box>

          {/* Giá trị doanh thu + Tăng trưởng */}
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              sx={{ color: "#fff", fontWeight: "bold", mr: 3 }}
            >
              {formatNumber(growthData.dayRevenue)} đ
            </Typography>
            {renderGrowth(growthData.dayGrowth)}
          </Box>
        </Box>

        {/* Doanh thu tuần */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#333333",
            p: 1,
            borderRadius: 1,
          }}
        >
          <Box display="flex" alignItems="center">
            <InsertChartIcon sx={{ color: "#fff", mr: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#fff" }}>
              Doanh thu tuần
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              sx={{ color: "#fff", fontWeight: "bold", mr: 3 }}
            >
              {formatNumber(growthData.weekRevenue)} đ
            </Typography>
            {renderGrowth(growthData.weekGrowth)}
          </Box>
        </Box>

        {/* Doanh thu tháng */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#333333",
            p: 1,
            borderRadius: 1,
          }}
        >
          <Box display="flex" alignItems="center">
            <InsertChartIcon sx={{ color: "#fff", mr: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#fff" }}>
              Doanh thu tháng
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              sx={{ color: "#fff", fontWeight: "bold", mr: 3 }}
            >
              {formatNumber(growthData.monthRevenue)} đ
            </Typography>
            {renderGrowth(growthData.monthGrowth)}
          </Box>
        </Box>

        {/* Doanh thu năm */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#333333",
            p: 1,
            borderRadius: 1,
          }}
        >
          <Box display="flex" alignItems="center">
            <InsertChartIcon sx={{ color: "#fff", mr: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#fff" }}>
              Doanh thu năm
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              sx={{ color: "#fff", fontWeight: "bold", mr: 3 }}
            >
              {formatNumber(growthData.yearRevenue)} đ
            </Typography>
            {renderGrowth(growthData.yearGrowth)}
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
};

export default RevenueGrowthStats;
