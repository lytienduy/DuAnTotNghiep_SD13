// RevenueCard.js
import { Paper, Box, Typography } from '@mui/material';

const RevenueCard = ({ label, value, productsSold, successfulOrders, canceledOrders, icon }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 2,
      minWidth: 280,
      textAlign: "center",
      backgroundColor: "#f5f5f5", // Màu nền sáng hơn
    }}
  >
    <Box mb={1}>
      {icon} {/* Đảm bảo icon được hiển thị ở đây */}
    </Box>
    <Typography variant="h6" fontWeight="bold" color="primary">
      {label}
    </Typography>
    <Typography variant="h4" fontWeight="bold" color="#0D47A1" mt={1}>
      {value}
    </Typography>
    <Box display="flex" justifyContent="space-around" mt={3}>
      <Box>
        <Typography variant="body2" color="textSecondary">Sản phẩm</Typography>
        <Typography variant="h6" fontWeight="bold">{productsSold}</Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary">Đơn thành công</Typography>
        <Typography variant="h6" fontWeight="bold">{successfulOrders}</Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary">Đơn hủy</Typography>
        <Typography variant="h6" fontWeight="bold">{canceledOrders}</Typography>
      </Box>
    </Box>
  </Paper>
);

export default RevenueCard;
