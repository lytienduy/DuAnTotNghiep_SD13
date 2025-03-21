import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box, InputBase, IconButton, Badge
} from "@mui/material";
import { Search, ShoppingCart, Person } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from '@mui/system';

const CustomTypography = styled(Typography)({
  fontFamily: '"Dancing Script", cursive', // Thêm font vào
  fontSize: '4rem', // Điều chỉnh kích thước chữ
  fontWeight: 700, // Chỉnh độ đậm chữ
  letterSpacing: '0.05em', // Điều chỉnh độ rộng của các chữ
  color: '#1976D2', // Chọn màu giống màu trong hình
  textTransform: 'none', // Không biến đổi thành chữ hoa toàn bộ
  lineHeight: 1.2, // Điều chỉnh khoảng cách giữa các dòng
});


const Header = () => {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const [soLuongTrongGioHang, setSoLuongTrongGioHang] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) { // Khi cuộn xuống hơn 150px
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //Hàm lấy số lượng giỏ hàng
  useEffect(() => {
    const interval = setInterval(() => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setSoLuongTrongGioHang(cart.length);
    }, 1000); // 60 giây
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  return (
    <Box >
      {/* Hotline & Hệ thống cửa hàng */}
      <Box
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          backgroundColor: "#1976D2",
          color: "white",
          position: "relative",
          width: "100%",
          height: "40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            whiteSpace: "nowrap",
            fontSize: 14,
            fontWeight: "bold",
            animation: "marquee 10s linear infinite",
          }}
        >
          Chào mừng bạn đến với shop quần Âu <span style={{ color: "#1976D2" }}>n</span>
          <b>DragonBee</b>
        </Typography>

        {/* Keyframes CSS */}
        <style>
          {`
         @keyframes marquee {
            from { left: 100%; } /* Bắt đầu từ ngoài màn hình bên phải */
            to { left: -100%; } /* Chạy sang ngoài màn hình bên trái */
          }
        `}
        </style>
      </Box>

      {/* Header chính */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: "1px solid #ddd" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Hotline & Hệ thống cửa hàng */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">
              📞 <b>HOTLINE: 0961886385</b>
            </Typography>
            <Typography variant="body2">📍 Hệ thống cửa hàng</Typography>
          </Box>

          {/* Logo */}
          <Box sx={{ textAlign: "center", mt: 2, marginLeft: 17 }}>
            <CustomTypography >DRAGONBEE</CustomTypography>


            {/* Chữ phía dưới đặt sát hơn */}
            <Typography sx={{ fontWeight: "bold", fontSize: 12, color: "#555", marginBottom: 2, marginLeft: 35, marginTop: -1.5 }}>
              Quần Âu chính hãng
            </Typography>
          </Box>

          {/* Thanh tìm kiếm và icon */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, size: "small" }}>
            {/* Thanh tìm kiếm (nhỏ hơn) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "15px", // Bo tròn nhẹ hơn
                px: 1.5, // Giảm padding ngang
                py: 0.3, // Giảm padding dọc
                width: "300px", // Thu nhỏ chiều rộng
                height: "32px", // Giảm chiều cao
              }}
            >
              <InputBase
                placeholder="Tìm kiếm"
                sx={{
                  flexGrow: 1,
                  fontSize: "14px", // Giảm kích thước chữ 
                }}
              />
              <IconButton sx={{ p: 0.5 }}>
                <Search sx={{ fontSize: "18px" }} /> {/* Giảm kích thước icon */}
              </IconButton>
            </Box>

            {/* Giỏ hàng & tài khoản */}
            <IconButton component="a" href="/gioHang">
              <Badge badgeContent={soLuongTrongGioHang} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton>
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu điều hướng */}
      <Box
        sx={{
          position: isSticky ? "fixed" : "relative",
          top: isSticky ? 0 : "auto",
          zIndex: 1000,
          backgroundColor: "white",
          width: "100%",
          boxShadow: isSticky ? "0px 2px 10px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s ease-in-out",
          display: "flex",
          justifyContent: "center",
          gap: 3,
          py: 1,
        }}
      >
        {[
          { label: "Trang chủ", path: "/home" },
          { label: "Sản phẩm", path: "/sanPham" },
          { label: "Giới thiệu", path: "/about" },
          { label: "Tin tức", path: "/news" },
          { label: "Liên hệ", path: "/contact" },
          { label: "Tra cứu", path: "/lookup" },
        ].map((item) => (
          <Button
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              textTransform: "none",
              color: "black",
              position: "relative", // Để tạo đường gạch chân tùy chỉnh
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: -2, // Điều chỉnh khoảng cách với chữ
                width: "100%",
                height: "2px", // Độ dày của đường gạch chân
                backgroundColor: location.pathname === item.path ? "#1976D2" : "transparent",
              },
            }}
          >
            {item.label}
          </Button>

        ))}

      </Box>
    </Box>
  );
};

export default Header;
