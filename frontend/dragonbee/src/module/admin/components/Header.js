import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Avatar, Paper, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom"; // Thêm để điều hướng

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate(); // Hook để điều hướng
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage khi trang Header được render
    const user = localStorage.getItem('userData');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
        padding: "0 16px",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Icon Menu */}
        <IconButton edge="start" color="inherit" sx={{ marginRight: 2, color: "black" }} onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>


        {/* Notification và User Avatar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Notification Icon */}
          <IconButton
            sx={{
              backgroundColor: "#f5f5ff",
              color: "#6a5acd",
              marginRight: 2,
              "&:hover": {
                backgroundColor: "#e0dfff",
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>

          {/* User Avatar */}
          {userData && (
            <IconButton sx={{ padding: 0 }}>
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: "50px",
                  marginRight: 2,
                }}
              >
                <span style={{fontSize:'15px'}}><span>Xin chào!</span> {userData.nhanVien?.tenNhanVien}</span>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    marginLeft: 8,
                    borderRadius: "50%",
                    overflow: "hidden",  // Giúp ảnh luôn được cắt tròn
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Hiển thị ảnh nếu có, nếu không có ảnh thì để một thẻ trống hoặc mặc định */}
                  {userData.nhanVien?.anh ? (
                    <img
                      src={userData.nhanVien.anh}
                      alt="User Avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // Giúp ảnh không bị méo và lấp đầy vùng chứa
                      }}
                    />
                  ) : (
                    <PersonIcon /> // Nếu không có ảnh, hiển thị icon mặc định (hoặc bạn có thể để trống)
                  )}
                </div>
                
              </Paper>
            </IconButton>
          )}

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
