import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

// Chart.js v3: đăng ký các thành phần cần thiết
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Chuyển đổi giá trị filter tiếng Anh sang tiếng Việt.
 * @param {string} filter - Giá trị filter (today, week, month, year)
 * @returns {string} - Giá trị tương ứng bằng tiếng Việt.
 */
const convertFilterToVietnamese = (filter) => {
  switch (filter) {
    case "today":
      return "ngày";
    case "week":
      return "tuần";
    case "month":
      return "tháng";
    case "year":
      return "năm";
    case "custom":
      return "tùy chỉnh";
    default:
      return filter;
  }
};

const OrderStatusPieChart = ({ filter ,customStartDate, customEndDate}) => {
  const [chartData, setChartData] = useState(null);

  const options = {
    responsive: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 20,
          padding: 15,
          font: {
            size: 14,
            weight: "normal",
          },
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            const total = dataset.data.reduce((sum, value) => sum + value, 0);
            return chart.data.labels.map((label, i) => {
              const value = dataset.data[i];
              const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: dataset.backgroundColor[i],
                hidden:
                  isNaN(value) || chart.getDataVisibility(i) === false,
                index: i,
              };
            });
          },
        },
      },
    },
  };

  const fetchChartData = async () => {
    try {
      let response;
      if (filter === "custom") {
        if (!customStartDate || !customEndDate) return;
        response = await axios.get("http://localhost:8080/api/order-status/custom", {
          params: { startDate: customStartDate, endDate: customEndDate },
        });
      } else {
        response = await axios.get(`http://localhost:8080/api/order-status/${filter}`);
      }

      const data = response.data;
      const labels = data.map((item) => item.trangThai);
      const values = data.map((item) => item.soLuong);

      setChartData({
        labels,
        datasets: [
          {
            label: "Số lượng đơn hàng",
            data: values,
            backgroundColor: [
              "#0D47A1", "#009688", "#b8e986", "#efadad", "#2196F3",
              "#607D8B", "#FFC107", "#4CAF50", "#F44336"
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
    }
  };

  useEffect(() => {
    if (filter === "custom" && (!customStartDate || !customEndDate)) return;
    fetchChartData();
  }, [filter, customStartDate, customEndDate]);

  return (
    <Paper sx={{ pl: 6,pt:2, pb:6, height:350,  mt: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={1} >
        Biểu đồ trạng thái đơn hàng theo {convertFilterToVietnamese(filter).toLowerCase()}
      </Typography>
      {chartData ? (
        <Box sx={{mt:0}}>
          <Pie data={chartData} options={options} width={400} height={400} />
        </Box>
      ) : (
        <Typography textAlign="center">Đang tải dữ liệu...</Typography>
      )}
    </Paper>
  );
};

OrderStatusPieChart.propTypes = {
  filter: PropTypes.oneOf(["today", "week", "month", "year", "custom"]).isRequired,
  customStartDate: PropTypes.string,
  customEndDate: PropTypes.string,
};

export default OrderStatusPieChart;
