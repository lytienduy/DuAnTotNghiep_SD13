import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, Button, Box, InputBase, IconButton, Badge, MenuItem, Menu, Avatar
} from "@mui/material";
import { Search, ShoppingCart, Person } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/system";


const CustomTypography = styled(Typography)({
  fontFamily: '"Dancing Script", cursive', // Thêm font vào
  fontSize: "4rem", // Điều chỉnh kích thước chữ
  fontWeight: 700, // Chỉnh độ đậm chữ
  letterSpacing: "0.05em", // Điều chỉnh độ rộng của các chữ
  color: "#1976D2", // Chọn màu giống màu trong hình
  textTransform: "none", // Không biến đổi thành chữ hoa toàn bộ
  lineHeight: 1.2, // Điều chỉnh khoảng cách giữa các dòng
});

const Header = () => {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const [soLuongTrongGioHang, setSoLuongTrongGioHang] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  // Check if the user is logged in by checking localStorage
  const userKH = JSON.parse(localStorage.getItem('userKH'));

  const goToDonMua = () => {
    navigate('/donMua');
    handleClose(); // Close the menu after navigation
  };

  // Open the menu when clicking the icon
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        // Khi cuộn xuống hơn 150px
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
    const interval = setInterval(async () => {
      if (userKH?.khachHang?.id) {
        const response = await axios.post(`http://localhost:8080/gioHang/layDuLieuCartVaXoaSanPhamSoLuong0`, null,
          {
            params: {
              idKhachHang: userKH?.khachHang?.id
            }
          });//Gọi api bằng  
        setSoLuongTrongGioHang(response.data?.length);
      } else {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setSoLuongTrongGioHang(cart.length);
      }
    }, 1000); // 60 giây
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);



  // Navigate to the login page or any other page
  const goToLogin = () => {
    navigate('/login');
    handleClose();
  };

  // Navigate to registration page
  const goToRegister = () => {
    navigate('/register');
    handleClose();
  };
  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('userKH');
    localStorage.removeItem('tokenKH');
    navigate('/home');
    handleClose();
  };

  // Get first and last name initials
  const getNameInitials = (name) => {
    const nameArray = name.split(' ');
    const firstInitial = nameArray[0]?.charAt(0).toUpperCase(); // First character of first name
    const lastInitial = nameArray[nameArray.length - 1]?.charAt(0).toUpperCase(); // First character of last name
    return firstInitial + lastInitial;
  };

  return (
    <Box>
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
          Chào mừng bạn đến với shop quần Âu{" "}
          <span style={{ color: "#1976D2" }}>n</span>
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
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: "1px solid #ddd" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Hotline & Hệ thống cửa hàng */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">
              📞 <b>HOTLINE: 0961886385</b>
            </Typography>
            <Typography variant="body2">📍 Hệ thống cửa hàng</Typography>
          </Box>

          {/* Logo */}
          <Box sx={{ textAlign: "center", mt: 2, marginLeft: 17 }}>
            <CustomTypography>DRAGONBEE</CustomTypography>

            {/* Chữ phía dưới đặt sát hơn */}
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: 12,
                color: "#555",
                marginBottom: 2,
                marginLeft: 35,
                marginTop: -1.5,
              }}
            >
              Quần Âu chính hãng
            </Typography>
          </Box>

          {/* Thanh tìm kiếm và icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              size: "small",
            }}
          >
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
                <Search sx={{ fontSize: "18px" }} />{" "}
                {/* Giảm kích thước icon */}
              </IconButton>
            </Box>

            {/* Giỏ hàng & tài khoản */}
            <IconButton component="a" href="/gioHang">
              <Badge badgeContent={soLuongTrongGioHang} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <div>
              {/* Person Icon */}
              <IconButton onClick={handleClick}>
                {userKH ? (
                  // Display initials if user is logged in
                  <Avatar
                    sx={{
                      bgcolor: '#1976D2', // Gray background
                      color: 'white', // White text
                      width: 40,
                      height: 40,
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    {getNameInitials(userKH?.khachHang?.tenKhachHang)}
                  </Avatar>
                ) : (
                  // Display person icon if not logged in
                  <Person />
                )}
              </IconButton>

              {/* Menu with dynamic items */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                  onMouseLeave: handleClose, // Close menu when mouse leaves
                }}
                PaperProps={{
                  sx: {
                    width: '200px', // Adjust width as needed
                  },
                }}
              >
                {userKH ? (

                  <>
                    <MenuItem onClick={handleClose}>
                      <Typography color="textSecondary">Tài khoản của tôi</Typography>
                    </MenuItem>
                    <MenuItem onClick={goToDonMua}>
                      <Typography color="textSecondary">Đơn mua</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography color="textSecondary">Đăng xuất</Typography>
                    </MenuItem>
                  </>
                ) : (
                  // If not logged in, show Login and Register options
                  <>
                    <MenuItem onClick={goToLogin}>
                      <Typography color="textSecondary">Đăng nhập</Typography>
                    </MenuItem>
                    <MenuItem onClick={goToRegister}>
                      <Typography color="textSecondary">Đăng ký</Typography>
                    </MenuItem>
                  </>
                )}
              </Menu>
            </div>
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
                backgroundColor:
                  location.pathname === item.path ? "#1976D2" : "transparent",
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
